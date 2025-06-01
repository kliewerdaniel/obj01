# obj01/api/graph.py

from fastapi import APIRouter
from nlp.entity_extractor import extract_entity_relationships, build_networkx_graph
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/graph.json")
def get_graph():
    text = """
    President Joe Biden met with executives from Apple and Google in Washington D.C. on Monday.
    Elon Musk and Bill Gates also attended the event.
    """
    triples = extract_entity_relationships(text)
    G = build_networkx_graph(triples)

    # Convert to D3-friendly JSON
    nodes = [{"id": n} for n in G.nodes]
    links = [{"source": u, "target": v, "label": d["label"]} for u, v, d in G.edges(data=True)]

    return JSONResponse(content={"nodes": nodes, "links": links})