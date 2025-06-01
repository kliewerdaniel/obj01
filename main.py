from api import graph as graph_router
from fastapi import FastAPI

app = FastAPI()

app.include_router(graph_router.router)


from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/graph")
def serve_graph_page():
    return FileResponse("static/graph.html")