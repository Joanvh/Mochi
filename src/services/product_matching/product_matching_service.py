from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
import uuid

router = APIRouter(prefix="/api/v1/product-matching", tags=["Product Matching"])

# --- MODELOS DE DATOS ---

class Producto(BaseModel):
    """Representa un producto real del catálogo de la tienda."""
    id_producto: str
    nombre: str
    precio: float
    pasillo: str

class BusquedaCreate(BaseModel):
    """Modelo para recibir el texto de la lista de la compra."""
    texto_busqueda: str = Field(..., description="Texto introducido por el usuario (ej: 'leche')")

class BusquedaUpdate(BaseModel):
    """Modelo para actualizar un texto introducido previamente."""
    texto_busqueda: str = Field(..., description="Nuevo texto corregido")

class BusquedaResponse(BaseModel):
    """Respuesta al crear o modificar una búsqueda."""
    id_busqueda: str
    texto_busqueda: str

# --- BASE DE DATOS SIMULADA ---

# Almacena las búsquedas activas de los usuarios durante su sesión
db_busquedas = {}

# Catálogo simulado para el MVP
CATALOGO_MOCK = [
    Producto(id_producto="P001", nombre="Leche Semidesnatada Hacendado", precio=0.85, pasillo="Pasillo 4"),
    Producto(id_producto="P002", nombre="Leche Entera Pascual", precio=1.15, pasillo="Pasillo 4"),
    Producto(id_producto="P003", nombre="Carne Picada Vacuno", precio=4.50, pasillo="Pasillo 7"),
    Producto(id_producto="P004", nombre="Queso Rallado Emmental", precio=1.20, pasillo="Pasillo 3")
]

# --- ENDPOINTS ---

@router.post("/", response_model=BusquedaResponse, status_code=201)
async def crear_busqueda(busqueda_in: BusquedaCreate):
    """
    Recibe el texto de un ítem de la lista de la compra, le asigna un ID único 
    y lo almacena para poder operar sobre él posteriormente.
    """
    nueva_busqueda = BusquedaResponse(
        id_busqueda=str(uuid.uuid4()),
        texto_busqueda=busqueda_in.texto_busqueda
    )
    db_busquedas[nueva_busqueda.id_busqueda] = nueva_busqueda
    
    return nueva_busqueda


@router.get("/{id_busqueda}/GetRelacionados", response_model=List[Producto])
async def obtener_productos_relacionados(id_busqueda: str):
    """
    Recupera una búsqueda previa por su ID y devuelve los productos 
    del catálogo que coinciden con ese texto.
    """
    if id_busqueda not in db_busquedas:
        raise HTTPException(status_code=404, detail="Búsqueda no encontrada")
        
    texto_buscado = db_busquedas[id_busqueda].texto_busqueda.lower()
    
    # Lógica de matching básica: buscar si el texto está contenido en el nombre del producto.
    # Aquí es donde se conectaría tu algoritmo real de búsqueda o base de datos en el futuro.
    productos_encontrados = [
        producto for producto in CATALOGO_MOCK 
        if texto_buscado in producto.nombre.lower()
    ]
    
    return productos_encontrados


@router.patch("/{id_busqueda}", response_model=BusquedaResponse)
async def actualizar_busqueda(id_busqueda: str, busqueda_upd: BusquedaUpdate):
    """
    Permite modificar el texto de una búsqueda existente (por ejemplo, si el 
    usuario edita su lista cambiando 'carne' por 'carne picada').
    """
    if id_busqueda not in db_busquedas:
        raise HTTPException(status_code=404, detail="Búsqueda no encontrada")
        
    # Actualizamos el texto en la base de datos simulada
    busqueda_actual = db_busquedas[id_busqueda]
    busqueda_actual.texto_busqueda = busqueda_upd.texto_busqueda
    db_busquedas[id_busqueda] = busqueda_actual
    
    return busqueda_actual