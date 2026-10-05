from fastapi import FastAPI
from incidents.incidents_service import router as incidencias_router

app = FastAPI(title="Mercadona Sync API")

# Se conectan los módulos de cada persona
app.include_router(incidencias_router)