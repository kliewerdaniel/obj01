# obj01/api/graph.py

from fastapi import APIRouter
from nlp.entity_extractor import extract_entity_relationships, build_networkx_graph
from fastapi.responses import JSONResponse
import os
import json
current_dir = os.path.dirname(__file__)
news_digest_filepath = os.path.join(current_dir, '..', 'output', 'news_digest_2025-06-01.json')
with open(news_digest_filepath, 'r') as f:
    news_digest_json = json.load(f)
router = APIRouter()

@router.get("/graph.json")
def get_graph():

    with open(news_digest_filepath, 'r') as f:
        summaries = json.load(f)

    text = summaries[0]['summary']  # or 'summary' if that's more appropriate
    triples = extract_entity_relationships(text)
    
    G = build_networkx_graph(triples)

    # Convert to D3-friendly JSON
    nodes = [{"id": n} for n in G.nodes]
    links = [{"source": u, "target": v, "label": d["label"]} for u, v, d in G.edges(data=True)]

    return JSONResponse(content={"nodes": nodes, "links": links})