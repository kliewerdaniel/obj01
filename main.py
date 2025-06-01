import subprocess
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

@app.get("/api/run_pipeline")
def run_pipeline():
    try:
        result = subprocess.run(["python", "pipeline.py"], capture_output=True, text=True, check=True)
        return {"status": "success", "stdout": result.stdout, "stderr": result.stderr}
    except subprocess.CalledProcessError as e:
        return {"status": "error", "stdout": e.stdout, "stderr": e.stderr, "message": str(e)}
    except Exception as e:
        return {"status": "error", "message": str(e)}
