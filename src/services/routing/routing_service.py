from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

router = APIRouter(prefix="/api/v1/routing", tags=["Routing"])

# --- MODELOS DE DATOS ---

class RouteRequest(BaseModel):
    """Petición para calcular o recalcular una ruta."""
    nodo_origen: str = Field(..., description="ID del nodo actual del cliente (ej: 'entrada' o 'pasillo_3')")
    nodos_destino: List[str] = Field(..., description="Lista de IDs de los nodos donde están los productos")
    nodos_evitar: Optional[List[str]] = Field(default=[], description="Nodos con incidencias a evitar en el cálculo")

class PasoRuta(BaseModel):
    """Representa un único paso o nodo dentro del recorrido óptimo."""
    nodo_id: str
    accion: str = Field(..., description="Ej: 'Avanzar', 'Girar derecha', 'Recoger producto'")
    coste_tiempo_segundos: int

class RouteResponse(BaseModel):
    """Respuesta con la ruta completa optimizada por tiempo."""
    id_ruta: str
    recorrido: List[PasoRuta]
    tiempo_total_segundos: int
    caja_recomendada: str = Field(..., description="La caja con menor tiempo de espera asignada")

# --- LÓGICA SIMULADA (Mock del Grafo y Dijkstra) ---

def calcular_tsp_dijkstra(origen: str, destinos: List[str], evitar: List[str]):
    """
    Simulación del algoritmo de enrutamiento. 
    En un entorno real, aquí se cargaría el grafo de la tienda y se ejecutaría:
    1. Dijkstra para conocer las distancias/tiempos entre todos los puntos de interés.
    2. Un algoritmo TSP (Problema del Viajante) para ordenar los productos de forma óptima.
    """
    # Si detectamos un nodo bloqueado (ej: por una incidencia en la API de incidencias)
    if "pasillo_5" in evitar:
        print("[ALGORITMO] Recalculando ruta evitando el pasillo 5...")

    # Mock de la ruta generada
    pasos_mock = [
        PasoRuta(nodo_id=origen, accion="Inicio del recorrido", coste_tiempo_segundos=0),
        PasoRuta(nodo_id="pasillo_4", accion="Recoger Leche Semidesnatada", coste_tiempo_segundos=45),
        PasoRuta(nodo_id="pasillo_7", accion="Recoger Carne Picada", coste_tiempo_segundos=60),
    ]
    
    return pasos_mock, 105, "Caja Rápida 2"

# --- ENDPOINTS ---

@router.post("/calcular", response_model=RouteResponse, status_code=200)
async def calcular_ruta_optima(request: RouteRequest):
    """
    Genera la ruta más rápida para recoger todos los productos de la lista.
    Este endpoint se llama al iniciar la compra o cuando hay un recálculo automático 
    debido a una incidencia.
    """
    if not request.nodos_destino:
        raise HTTPException(status_code=400, detail="La lista de destinos no puede estar vacía")

    # Llamada al "cerebro algorítmico"
    pasos, tiempo_total, caja = calcular_tsp_dijkstra(
        origen=request.nodo_origen,
        destinos=request.nodos_destino,
        evitar=request.nodos_evitar
    )

    respuesta = RouteResponse(
        id_ruta=str(uuid.uuid4()),
        recorrido=pasos,
        tiempo_total_segundos=tiempo_total,
        caja_recomendada=caja
    )
    
    return respuesta