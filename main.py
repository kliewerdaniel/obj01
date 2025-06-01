# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from api.graph import router as graph_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev. Lock it down in prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router mounted at /api/graph
app.include_router(graph_router, prefix="/api/graph")

# Serve static files (e.g. your graph.html page)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/graph")
def serve_graph_page():
    return FileResponse("static/graph.html")
