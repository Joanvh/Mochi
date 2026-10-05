#!/usr/bin/env python3
"""
Rutas sobre el "gemelo digital" de una tienda (grid) -> Dijkstra + vecino más cercano + 2-opt.

Cada sección (producto, entrada o cajas) tiene un id ENTERO. La ruta se pide indicando la
sección de comienzo y la de fin; si no se indican, se usa la entrada por defecto (default_entrance)
para las dos.

Uso:
  python route.py tienda_ejemplo2.json 10721 31592 5063 2794
  # sección de comienzo y de fin (ids de "sections"):
  python route.py tienda_ejemplo2.json 10721 31592 --start-section 102 --end-section 202
  # recalcular desde donde estás (p. ej. en la sección 3) con un pasillo bloqueado:
  python route.py tienda_ejemplo2.json 10721 31592 --start-section 3 --block 10,5
  # congestión: una sección entera (id,coste) o un rectángulo x1,y1,x2,y2,coste
  python route.py tienda_ejemplo2.json 10721 31592 --jam-section 201,30
  python route.py tienda_ejemplo2.json 10721 31592 --jam-rect 1,5,20,6,8
  # celda con coste extra / bloqueada:
  python route.py tienda_ejemplo2.json 10721 31592 --jam 5,5,6 --block 10,5
  # comprobar que todos los pasillos miden >= 2 celdas y que el JSON es coherente:
  python route.py tienda_ejemplo2.json --check
"""
import argparse, heapq, json, sys

WALKABLE = set(".EC")
INF = float("inf")
DIRS = ((0, -1), (0, 1), (-1, 0), (1, 0))


class Store:
    def __init__(self, path):
        with open(path, encoding="utf-8") as f:
            self.data = json.load(f)
        self.grid = self.data["grid"]
        self.h, self.w = len(self.grid), len(self.grid[0])
        assert all(len(r) == self.w for r in self.grid), "filas de distinto ancho"

        self.sections = {s["id"]: s for s in self.data["sections"]}
        self.placements = {p["product_id"]: p for p in self.data["placements"]}
        self.default_entrance = self.data["default_entrance"]
        self.problems = self.validate()

        # coste extra por celda (congestión). INF = bloqueada. _base = lo que viene en el JSON
        self.extra = {}
        for x, y, c in self.data.get("dynamic", {}).get("jams", []):
            self.extra[(x, y)] = c
        for x, y in self.data.get("dynamic", {}).get("blocked", []):
            self.extra[(x, y)] = INF
        self._base_extra = dict(self.extra)

    # ------------------------------------------------------------------ validación
    def validate(self):
        errs = []
        ids = [s["id"] for s in self.data["sections"]]
        if not all(isinstance(i, int) and not isinstance(i, bool) for i in ids):
            errs.append("todos los id de sections deben ser enteros")
        if len(set(ids)) != len(ids):
            errs.append("hay ids de sección repetidos")
        d = self.sections.get(self.default_entrance)
        if d is None or d["tipo"] != "entrada":
            errs.append("default_entrance debe ser el id de una sección de tipo 'entrada'")
        for p in self.data["placements"]:
            if p["section"] not in self.sections:
                errs.append(f"el producto {p['product_id']} usa una sección inexistente: {p['section']}")
        return errs

    def check_corridors(self):
        """Todo punto transitable debe pertenecer a un bloque 2x2 transitable (pasillo >= 2)."""
        base = lambda c: (0 <= c[0] < self.w and 0 <= c[1] < self.h
                          and self.grid[c[1]][c[0]] in WALKABLE)
        bad = []
        for y in range(self.h):
            for x in range(self.w):
                if base((x, y)):
                    ok = any(all(base((x + dx + i, y + dy + j)) for i in (0, 1) for j in (0, 1))
                             for dx in (-1, 0) for dy in (-1, 0))
                    if not ok:
                        bad.append((x, y))
        return bad

    # ------------------------------------------------------------------ mapa
    def walkable(self, c):
        x, y = c
        return (0 <= x < self.w and 0 <= y < self.h
                and self.grid[y][x] in WALKABLE and self.extra.get(c, 0) != INF)

    def neighbors(self, c):
        x, y = c
        for dx, dy in DIRS:
            n = (x + dx, y + dy)
            if self.walkable(n):
                yield n

    def section_cells(self, section_id):
        """Celdas transitables desde las que se 'está en' una sección.
        entrada/cajas -> sus propias celdas E/C. producto -> pasillo pegado a sus lineales."""
        s = self.sections.get(section_id)
        if s is None:
            raise ValueError(f"La sección {section_id} no existe en {self.data['store_id']}")
        x1, y1, x2, y2 = s["rect"]
        cells = [(x, y) for y in range(y1, y2 + 1) for x in range(x1, x2 + 1)]
        if s["tipo"] in ("entrada", "cajas"):
            return [c for c in cells if self.walkable(c)]
        out = set()
        for x, y in cells:
            if self.grid[y][x] == "#":
                out.update(self.neighbors((x, y)))
        return sorted(out)

    def access_cell(self, product_id):
        """Celda de pasillo desde la que se coge el producto (vecina a su lineal)."""
        x, y = self.placements[product_id]["cell"]
        for dx, dy in DIRS:
            n = (x + dx, y + dy)
            if self.walkable(n):
                return n
        return None

    # ------------------------------------------------------------------ incidencias
    def add_extra_rect(self, rect, cost):
        x1, y1, x2, y2 = rect
        for y in range(y1, y2 + 1):
            for x in range(x1, x2 + 1):
                self.extra[(x, y)] = cost

    def jam_section(self, section_id, cost):
        """Congestión en una sección (coste extra por cada celda que se pise junto a ella)."""
        for c in self.section_cells(section_id):
            self.extra[c] = cost

    def block_section(self, section_id):
        for c in self.section_cells(section_id):
            self.extra[c] = INF

    def clear_incidents(self):
        self.extra = dict(self._base_extra)

    # ------------------------------------------------------------------ Dijkstra
    def dijkstra(self, sources):
        """Dijkstra multi-origen sobre la cuadrícula. Devuelve (dist, prev) de toda la zona alcanzable.
        Coste de dar un paso a una celda = 1 + coste extra de esa celda (congestión)."""
        dist = {s: 0 for s in sources}
        prev = {}
        pq = [(0, s) for s in sources]
        heapq.heapify(pq)
        while pq:
            d, cur = heapq.heappop(pq)
            if d > dist.get(cur, INF):
                continue
            for n in self.neighbors(cur):
                nd = d + 1 + self.extra.get(n, 0)
                if nd < dist.get(n, INF):
                    dist[n], prev[n] = nd, cur
                    heapq.heappush(pq, (nd, n))
        return dist, prev

    @staticmethod
    def _path(prev, target):
        path = [target]
        while path[-1] in prev:
            path.append(prev[path[-1]])
        return path[::-1]

    # ------------------------------------------------------------------ ruta
    def plan(self, product_ids, start_section=None, end_section=None):
        """Calcula la ruta forzando el emparejamiento estricto entre Salida y Cajas."""
        start_id = self.default_entrance if start_section is None else int(start_section)
        end_id = self.default_entrance if end_section is None else int(end_section)
        start_cells, end_cells = self.section_cells(start_id), self.section_cells(end_id)
        
        if not start_cells or not end_cells:
            raise ValueError("La sección de comienzo o fin no tiene celdas transitables.")

        dist0, _ = self.dijkstra(start_cells)
        
        missing, stops = [], []
        for pid in dict.fromkeys(str(p) for p in product_ids):
            p = self.placements.get(pid)
            if p is None:
                missing.append({"product_id": pid, "reason": "desconocido"})
            elif not p.get("disponible", True):
                missing.append({"product_id": pid, "reason": "agotado"})
            else:
                cell = self.access_cell(pid)
                if cell is None or dist0.get(cell, INF) == INF:
                    missing.append({"product_id": pid, "reason": "inaccesible"})
                else:
                    stops.append((pid, cell))

        # 1. Optimización TSP
        nodes = [start_cells] + [[c] for _, c in stops] + [end_cells]
        n = len(nodes)
        D = [[0] * n for _ in range(n)]
        for i in range(n - 1):
            dist, prev = self.dijkstra(nodes[i])
            for j in range(i + 1, n):
                best = min(nodes[j], key=lambda c: dist.get(c, INF))
                D[i][j] = D[j][i] = dist.get(best, INF)
        
        order = [0]
        left = set(range(1, n - 1))
        while left:
            nxt = min(left, key=lambda j: D[order[-1]][j])
            order.append(nxt)
            left.remove(nxt)
        order.append(n - 1)
        
        improved = True
        while improved:
            improved = False
            for i in range(1, n - 2):
                for j in range(i + 1, n - 1):
                    a, b, c, d = order[i - 1], order[i], order[j], order[j + 1]
                    if D[a][c] + D[b][d] < D[a][b] + D[c][d] - 1e-9:
                        order[i:j + 1] = reversed(order[i:j + 1])
                        improved = True
                        
        ordered = [stops[i - 1] for i in order[1:-1]]

        # 2. Trazado continuo tramo a tramo (evita teletransportes)
        path = []
        seq_sections = [start_id]
        current_cells = start_cells
        
        for pid, cell in ordered:
            dist, prev = self.dijkstra(current_cells)
            seg = self._path(prev, cell)
            path += seg if not path else seg[1:]
            current_cells = [cell]
            seq_sections.append(self.placements[pid]["section"])
            
        # 3. Regla de Negocio: Mapeo estricto de Cajas según la Salida elegida
        target_caja_id = None
        if end_id == 901:
            target_caja_id = 801
        elif end_id == 902:
            target_caja_id = 802

        # Ejecutar trazado forzado si la caja asignada existe en la tienda
        if target_caja_id and target_caja_id in self.sections:
            c_cells = self.section_cells(target_caja_id)
            dist_from_last, prev_last = self.dijkstra(current_cells)
            
            entry_cell = min(c_cells, key=lambda c: dist_from_last.get(c, INF))
            
            if dist_from_last.get(entry_cell, INF) != INF:
                dist_from_caja, prev_caja = self.dijkstra(c_cells)
                exit_cell = min(end_cells, key=lambda c: dist_from_caja.get(c, INF))
                
                if dist_from_caja.get(exit_cell, INF) != INF:
                    # Trazar al punto de entrada de la caja
                    seg_caja = self._path(prev_last, entry_cell)
                    path += seg_caja if not path else seg_caja[1:]
                    seq_sections.append(target_caja_id)
                    
                    # Trazar desde la caja a la salida
                    seg_end = self._path(prev_caja, exit_cell)
                    path += seg_end if not path else seg_end[1:]
                    seq_sections.append(end_id)
                    current_cells = [exit_cell] # Bloquear el fallback
                
        # Fallback: Si no hay cajas definidas o la ruta asignada está cortada por un bloqueo (incidencia)
        if seq_sections[-1] != end_id:
            dist_to_end, prev_end = self.dijkstra(current_cells)
            exit_cell = min(end_cells, key=lambda c: dist_to_end.get(c, INF))
            seg = self._path(prev_end, exit_cell)
            path += seg if not path else seg[1:]
            seq_sections.append(end_id)
            
        # Limpiar secciones duplicadas contiguas para la UI
        sections = [s for k, s in enumerate(seq_sections) if k == 0 or s != seq_sections[k - 1]]

        steps = len(path) - 1
        return {
            "store_id": self.data["store_id"],
            "start_section": start_id,
            "end_section": end_id,
            "sections": sections,
            "ordered_stops": [
                {"product_id": pid, "section": self.placements[pid]["section"],
                 "shelf": self.placements[pid]["cell"], "access": list(cell)}
                for pid, cell in ordered],
            "path": [list(c) for c in path],
            "start_cell": list(path[0]),
            "end_cell": list(path[-1]),
            "steps": steps,
            "meters": round(steps * self.data.get("cell_size_m", 1), 1),
            "cost": sum(1 + self.extra.get(c, 0) for c in path[1:]),
            "missing": missing,
        }

    def route_sections(self, product_ids, start_section=None, end_section=None):
        """Atajo: solo la lista de ids de sección por orden, p. ej. [101, 1, 3, 2, 101]."""
        return self.plan(product_ids, start_section, end_section)["sections"]

    def ascii(self, result):
        g = [list(r) for r in self.grid]
        for x, y in result["path"]:
            if g[y][x] == ".":
                g[y][x] = "*"
        sx, sy = result["start_cell"]
        g[sy][sx] = "S"
        for k, s in enumerate(result["ordered_stops"], 1):
            x, y = s["shelf"]
            g[y][x] = str(k % 10)
        return "\n".join("".join(r) for r in g)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("store")
    ap.add_argument("products", nargs="*")
    ap.add_argument("--check", action="store_true", help="validar pasillos y coherencia del JSON")
    ap.add_argument("--start-section", type=int, help="id de la sección de comienzo (defecto: entrada por defecto)")
    ap.add_argument("--end-section", type=int, help="id de la sección de fin (defecto: entrada por defecto)")
    ap.add_argument("--jam-section", action="append", default=[], help="id_seccion,coste_extra")
    ap.add_argument("--jam-rect", action="append", default=[], help="x1,y1,x2,y2,coste_extra")
    ap.add_argument("--jam", action="append", default=[], help="x,y,coste_extra")
    ap.add_argument("--block", action="append", default=[], help="x,y")
    ap.add_argument("--catalog", default="productos_mock.json")
    ap.add_argument("--json", action="store_true", help="imprimir el resultado completo en JSON")
    a = ap.parse_args()

    st = Store(a.store)
    if a.check:
        bad = st.check_corridors()
        print("Pasillos OK (todos >= 2 celdas)" if not bad else f"Pasillos de 1 celda en: {bad}")
        print("JSON coherente" if not st.problems else "Problemas en el JSON:\n  " + "\n  ".join(st.problems))
        print(f"Secciones: {sorted(st.sections)} | entrada por defecto: {st.default_entrance}")
        sys.exit(0 if not bad and not st.problems else 1)

    for js in a.jam_section:
        sid, c = js.split(",")
        st.jam_section(int(sid), float(c))
    for jr in a.jam_rect:
        v = list(map(float, jr.split(",")))
        st.add_extra_rect(list(map(int, v[:4])), v[4])
    for j in a.jam:
        x, y, c = map(float, j.split(","))
        st.extra[(int(x), int(y))] = c
    for b in a.block:
        x, y = map(int, b.split(","))
        st.extra[(x, y)] = INF

    try:
        r = st.plan(a.products, a.start_section, a.end_section)
    except ValueError as e:
        sys.exit(f"Error: {e}")

    if a.json:
        print(json.dumps(r, ensure_ascii=False))
        sys.exit(0)

    names = {}
    try:
        names = {p["id"]: p["nombre"] for p in json.load(open(a.catalog, encoding="utf-8"))}
    except FileNotFoundError:
        pass
    sec_name = lambda i: st.sections[i]["nombre"]

    print(st.ascii(r))
    print(f"\n{st.data['nombre']}: {r['steps']} pasos (~{r['meters']} m), coste {r['cost']}")
    print("Secciones en orden:", r["sections"])
    print("   " + " -> ".join(f"{i} {sec_name(i)}" for i in r["sections"]))
    for k, s in enumerate(r["ordered_stops"], 1):
        print(f"  {k}. {names.get(s['product_id'], s['product_id'])}  [sección {s['section']}]")
    for m in r["missing"]:
        print(f"  No incluido: {m['product_id']} ({m['reason']})")