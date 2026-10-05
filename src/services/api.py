"""
API de rutas (FastAPI). Arrancar desde esta carpeta:

    pip install fastapi uvicorn
    uvicorn api:app --reload --port 8000

Ejemplos (el recálculo es simplemente volver a pedir la ruta con otra sección de comienzo):

    GET /stores
    GET /stores/mercadona_valencia_centro                      -> plano (grid, sections, placements)
    GET /route?store_id=mercadona_valencia_centro&products=10721,31592,5063
    GET /route?store_id=...&products=10721&products=31592&start_section=102&end_section=202
    GET /route/sections?store_id=...&products=10721,31592      -> {"sections": [101, 1, 3, 101]}

    POST   /stores/{store_id}/incidents   {"type": "block", "section": 201}
                                          {"type": "jam", "section": 4, "cost": 20}
                                          {"type": "block", "cell": [10, 5]}
    DELETE /stores/{store_id}/incidents                         -> quita todas las incidencias
"""
import glob
import os
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from routing.route import INF, Store

DATA_DIR = os.environ.get("STORES_DIR", os.path.dirname(os.path.abspath(__file__)))

# Todas las tiendas se cargan una vez al arrancar. El estado de incidencias vive en memoria
# y es compartido por todos los clientes (suficiente para la demo).
STORES: dict[str, Store] = {}
for _path in sorted(glob.glob(os.path.join(DATA_DIR, "tienda_*.json"))):
    _st = Store(_path)
    if _st.problems:
        raise RuntimeError(f"{os.path.basename(_path)}: {'; '.join(_st.problems)}")
    STORES[_st.data["store_id"]] = _st

app = FastAPI(title="Mercadona Sync · rutas")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


def _store(store_id: str) -> Store:
    st = STORES.get(store_id)
    if st is None:
        raise HTTPException(404, f"Tienda desconocida: {store_id}. Disponibles: {list(STORES)}")
    return st


def _plan(store_id, products, start_section, end_section):
    flat = [p.strip() for item in products for p in item.split(",") if p.strip()]
    try:
        return _store(store_id).plan(flat, start_section, end_section)
    except ValueError as e:  # sección inexistente o sin camino
        raise HTTPException(422, str(e))


@app.get("/stores")
def list_stores():
    return [{"store_id": k, "nombre": s.data["nombre"]} for k, s in STORES.items()]


@app.get("/stores/{store_id}")
def get_store(store_id: str):
    return _store(store_id).data


@app.get("/route")
def get_route(
    store_id: str,
    products: list[str] = Query(default=[]),
    start_section: int | None = None,
    end_section: int | None = None,
):
    """Ruta completa: sections (ids en orden), path (celdas), ordered_stops, steps, meters, missing..."""
    return _plan(store_id, products, start_section, end_section)


@app.get("/route/sections")
def get_route_sections(
    store_id: str,
    products: list[str] = Query(default=[]),
    start_section: int | None = None,
    end_section: int | None = None,
):
    """Solo la lista de ids de sección por orden."""
    return {"sections": _plan(store_id, products, start_section, end_section)["sections"]}


class Incident(BaseModel):
    type: Literal["block", "jam"]
    section: int | None = None      # id de sección afectada...
    cell: list[int] | None = None   # ...o una celda [x, y]
    cost: float = 10                # solo para "jam": coste extra por celda


@app.post("/stores/{store_id}/incidents")
def add_incident(store_id: str, inc: Incident):
    st = _store(store_id)
    try:
        if inc.section is not None:
            st.block_section(inc.section) if inc.type == "block" else st.jam_section(inc.section, inc.cost)
        elif inc.cell is not None and len(inc.cell) == 2:
            st.extra[tuple(inc.cell)] = INF if inc.type == "block" else inc.cost
        else:
            raise HTTPException(422, "Indica 'section' o 'cell': [x, y]")
    except ValueError as e:
        raise HTTPException(422, str(e))
    return {"ok": True}


@app.delete("/stores/{store_id}/incidents")
def clear_incidents(store_id: str):
    _store(store_id).clear_incidents()
    return {"ok": True}



# --- MODELOS DE DATOS ---
class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    nombre: str
    perfil_dietetico: list[str]
    lista_compra: list[str]

# --- CARGA DE DATOS MOCK ---
DATA_DIR = os.environ.get("STORES_DIR", os.path.dirname(os.path.abspath(__file__)))
USUARIOS_FILE = os.path.join(DATA_DIR, "users.json")

def cargar_usuarios():
    try:
        with open(USUARIOS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# --- ENDPOINTS DE AUTENTICACIÓN ---

@app.post("/login", response_model=UserResponse, tags=["Autenticación"])
def login(credenciales: LoginRequest):
    """
    Valida las credenciales contra el JSON mockeado.
    En un entorno real, esto devolvería un JWT. Para el MVP, devuelve el perfil directamente.
    """
    usuarios = cargar_usuarios()
    
    for user in usuarios:
        if user["email"] == credenciales.email and user["password"] == credenciales.password:
            # Eliminar la contraseña antes de enviar la respuesta al cliente por seguridad
            return UserResponse(
                id=user["id"],
                email=user["email"],
                nombre=user["nombre"],
                perfil_dietetico=user.get("perfil_dietetico", []),
                lista_compra=user.get("lista_compra", [])
            )
            
    raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

@app.get("/users/{user_id}/lista", tags=["Usuario"])
def obtener_lista_compra(user_id: str):
    """
    Permite al frontend recuperar la lista activa del usuario sin volver a iniciar sesión.
    """
    usuarios = cargar_usuarios()
    for user in usuarios:
        if user["id"] == user_id:
            return {"lista_compra": user.get("lista_compra", [])}
            
    raise HTTPException(status_code=404, detail="Usuario no encontrado")