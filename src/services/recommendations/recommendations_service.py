from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

# Importamos el método main del archivo product_recommendations.py
# El punto (.) asume que ambos archivos están en la misma carpeta.
from .product_recommendations import main as generar_recomendaciones

router = APIRouter(prefix="/api/v1/recommendations", tags=["Recommendations"])

# --- MODELOS DE DATOS ---

class RecommendationRequest(BaseModel):
    """Modelo para recibir la lista de la compra actual del usuario."""
    lista_compra: List[str] = Field(
        ..., 
        description="Lista de productos actuales. Ej: ['pasta', 'tomate', 'carne picada']"
    )

class RecommendationResponse(BaseModel):
    """Modelo de respuesta con las sugerencias de cross-selling."""
    recomendaciones: List[str] = Field(
        ..., 
        description="Los 3 productos sugeridos para completar la compra"
    )

# --- ENDPOINTS ---

@router.post("/", response_model=RecommendationResponse, status_code=200)
async def recomendar_productos(request: RecommendationRequest):
    """
    Analiza la lista de la compra actual y propone productos complementarios 
    (cross-selling) utilizando el modelo de IA.
    """
    try:
        # Llamamos al método main pasándole la lista de strings
        resultado = generar_recomendaciones(request.lista_compra)
        
        # Nos aseguramos de extraer solo los 3 primeros elementos
        if isinstance(resultado, list):
            top_3 = resultado[:3]
        else:
            top_3 = []

        return RecommendationResponse(recomendaciones=top_3)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno al generar recomendaciones: {str(e)}"
        )