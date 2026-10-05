from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

# Importamos el método main del archivo externo
from .category_classification import main as clasificar_categorias

router = APIRouter(prefix="/api/v1/product-matching", tags=["Product Matching"])

# --- MODELOS DE DATOS ---

class ClasificacionRequest(BaseModel):
    """Modelo para recibir el texto de la lista de la compra."""
    texto_busqueda: str = Field(..., description="Texto introducido por el usuario (ej: 'leche de avena')")

class CategoriaResponse(BaseModel):
    """Modelo de respuesta con las categorías sugeridas."""
    categorias_sugeridas: List[str] = Field(..., description="Las 3 categorías más cercanas devueltas por el modelo")

# --- ENDPOINTS ---

@router.post("/clasificar", response_model=CategoriaResponse, status_code=200)
async def clasificar_producto(request: ClasificacionRequest):
    """
    Recibe el texto de la lista de la compra y devuelve el tipo de producto
    pasándolo por el modelo de clasificación.
    """
    try:
        # Llamamos al método main pasándole el string de búsqueda
        # Asumimos que category_classification.main(texto) devuelve una lista de strings
        resultado_categorias = clasificar_categorias(request.texto_busqueda)
        
        # Aseguramos que solo se devuelvan 3 categorías máximo
        top_3_categorias = [categoria['name'] for categoria in resultado_categorias[:3]] if isinstance(resultado_categorias, list) else []

        return CategoriaResponse(categorias_sugeridas=top_3_categorias)
        
    except Exception as e:
        # Capturamos cualquier error que pueda dar el archivo category_classification
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno al clasificar el producto: {str(e)}"
        )