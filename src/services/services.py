from fastapi import FastAPI, HTTPException
from incidents.incidents_service import router as incidents_router
from product_matching.product_matching_service import router as product_matching_router
from api import cargar_usuarios, router as routing_router
from recommendations.recommendations_service import router as recommendations_router

app = FastAPI(title="Mercadona Sync API")

# Se conectan los módulos de cada persona
app.include_router(incidents_router)
app.include_router(recommendations_router)
app.include_router(product_matching_router)
app.include_router(routing_router)

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

