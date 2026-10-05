from fastapi import FastAPI
from incidents.incidents_service import router as incidencias_router
from product_matching.product_matching_service import router as product_matching_router
from routing.routing_service import router as routing_router

app = FastAPI(title="Mercadona Sync API")

# Se conectan los módulos de cada persona
app.include_router(incidencias_router)
app.include_router(product_matching_router)
app.include_router(routing_router)