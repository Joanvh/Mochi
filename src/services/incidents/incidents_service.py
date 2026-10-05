from fastapi import FastAPI, HTTPException, BackgroundTasks, APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid
import asyncio

router = APIRouter(prefix="/api/v1/incidencias", tags=["Incidencias"])

# --- MODELOS DE DATOS ---

class TipoIncidencia(str, Enum):
    """Tipos de incidencias detectadas en la tienda según la documentación."""
    CONGESTION = "congestión"
    AGOTADO = "producto_agotado"
    REPOSICION = "reposición"
    BLOQUEO = "pasillo_bloqueado"
    DERRAME = "derrame"

class EstadoIncidencia(str, Enum):
    ACTIVA = "activa"
    RESUELTA = "resuelta"

class IncidenciaCreate(BaseModel):
    """Modelo para que el usuario o empleado reporte una incidencia."""
    tipo: TipoIncidencia = Field(..., description="Tipo de incidencia reportada.")
    nodo_id: str = Field(..., description="ID del pasillo, nodo del mapa o caja afectada.")
    descripcion: Optional[str] = Field(None, description="Detalles adicionales opcionales.")

class IncidenciaResponse(IncidenciaCreate):
    """Modelo de respuesta para el frontend."""
    id: str
    estado: EstadoIncidencia
    fecha_reporte: datetime

# --- BASE DE DATOS SIMULADA EN MEMORIA ---
# Para el MVP, almacenamos las incidencias en un diccionario
db_incidencias = {}

# --- SERVICIOS ASÍNCRONOS (Lógica de Negocio) ---

async def notificar_recalculo_ruta(incidencia: IncidenciaResponse):
    """
    Simula la comunicación asíncrona con el módulo de Routing (Persona 3).
    Modifica el coste o bloquea el recorrido y dispara el recálculo automático.
    """
    # Simulamos un retraso de procesamiento de red o algoritmo
    await asyncio.sleep(0.5) 
    print(f"[RECALCULO] Actualizando grafo de la tienda por incidencia {incidencia.id}.")
    print(f"[RECALCULO] Modificando coste para nodo {incidencia.nodo_id} debido a {incidencia.tipo}.")
    # Aquí se realizaría la llamada interna o evento WebSocket al frontend para actualizar la ruta de los usuarios afectados.

# --- ENDPOINTS (API Frontend) ---

@router.post("/PostIncidencias", response_model=IncidenciaResponse, status_code=201)
async def reportar_incidencia(incidencia_in: IncidenciaCreate, background_tasks: BackgroundTasks):
    """
    Permite a los usuarios reportar de forma colaborativa problemas que afectan al resto (estilo Waze).
    """
    nueva_incidencia = IncidenciaResponse(
        id=str(uuid.uuid4()),
        tipo=incidencia_in.tipo,
        nodo_id=incidencia_in.nodo_id,
        descripcion=incidencia_in.descripcion,
        estado=EstadoIncidencia.ACTIVA,
        fecha_reporte=datetime.now()
    )
    
    # Guardar en base de datos
    db_incidencias[nueva_incidencia.id] = nueva_incidencia
    
    # Ejecutar el recálculo de la ruta en segundo plano para no bloquear la respuesta al usuario
    background_tasks.add_task(notificar_recalculo_ruta, nueva_incidencia)
    
    return nueva_incidencia

@router.get("/GetIncidenciasActivas", response_model=List[IncidenciaResponse])
async def obtener_incidencias_activas():
    """
    Devuelve al frontend (mapa digital de la tienda) todas las incidencias activas 
    para mostrarlas como marcadores a los usuarios.
    """
    activas = [inc for inc in db_incidencias.values() if inc.estado == EstadoIncidencia.ACTIVA]
    return activas

@router.patch("/{incidencia_id}/PatchIncidencia", response_model=IncidenciaResponse)
async def resolver_incidencia(incidencia_id: str, background_tasks: BackgroundTasks):
    """
    Marca una incidencia como resuelta y dispara la normalización de la ruta.
    """
    if incidencia_id not in db_incidencias:
        raise HTTPException(status_code=404, detail="Incidencia no encontrada")
        
    incidencia = db_incidencias[incidencia_id]
    if incidencia.estado == EstadoIncidencia.RESUELTA:
        raise HTTPException(status_code=400, detail="La incidencia ya está resuelta")
        
    incidencia.estado = EstadoIncidencia.RESUELTA
    
    # Notificamos al sistema de rutas que el obstáculo ha desaparecido
    background_tasks.add_task(notificar_recalculo_ruta, incidencia)
    
    return incidencia