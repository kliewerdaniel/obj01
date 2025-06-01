# obj01/nlp/entity_extractor.py

import spacy
import networkx as nx
from typing import List, Dict, Tuple

nlp = spacy.load("en_core_web_sm")

def extract_named_entities(text: str) -> Dict[str, List[str]]:
    doc = nlp(text)
    entities = {
        "people": [],
        "organizations": [],
        "locations": []
    }

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            entities["people"].append(ent.text)
        elif ent.label_ == "ORG":
            entities["organizations"].append(ent.text)
        elif ent.label_ in ("GPE", "LOC"):
            entities["locations"].append(ent.text)

    for key in entities:
        seen = set()
        entities[key] = [x for x in entities[key] if not (x in seen or seen.add(x))]

    return entities

def extract_entity_relationships(text: str, scope: str = "sentence") -> List[Tuple[str, str, str]]:
    doc = nlp(text)
    relations = set()

    if scope == "sentence":
        segments = list(doc.sents)
    elif scope == "paragraph":
        segments = [nlp(p) for p in text.split("\n\n")]
    else:
        raise ValueError("Unsupported scope. Use 'sentence' or 'paragraph'.")

    for segment in segments:
        entities = [ent.text for ent in segment.ents if ent.label_ in {"PERSON", "ORG", "GPE", "LOC"}]
        entities = list(dict.fromkeys(entities))

        for i in range(len(entities)):
            for j in range(i + 1, len(entities)):
                e1, e2 = sorted((entities[i], entities[j]))
                relations.add((e1, "co_occurs_with", e2))

    return list(relations)

def build_networkx_graph(triples: List[Tuple[str, str, str]]) -> nx.Graph:
    """
    Convert triples into a NetworkX graph.

    Args:
        triples (List[Tuple[str, str, str]]): List of (entity1, relation, entity2)

    Returns:
        nx.Graph: A simple undirected graph
    """
    G = nx.Graph()

    for e1, relation, e2 in triples:
        G.add_node(e1)
        G.add_node(e2)
        G.add_edge(e1, e2, label=relation)

    return G

def export_triples_as_cypher(triples: List[Tuple[str, str, str]]) -> List[str]:
    """
    Convert triples into Cypher CREATE statements for Neo4j.

    Returns:
        List[str]: List of Cypher queries
    """
    cypher_queries = []

    for e1, relation, e2 in triples:
        query = (
            f"MERGE (a:Entity {{name: '{e1}'}}) "
            f"MERGE (b:Entity {{name: '{e2}'}}) "
            f"MERGE (a)-[:{relation.upper()}]->(b)"
        )
        cypher_queries.append(query)

    return cypher_queries