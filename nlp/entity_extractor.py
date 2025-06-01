# obj01/nlp/entity_extractor.py

import spacy
import networkx as nx
from typing import List, Dict, Tuple, Set

nlp = spacy.load("en_core_web_sm")


ENTITY_LABELS = {
    "people": {"PERSON"},
    "organizations": {"ORG"},
    "locations": {"GPE", "LOC"}
}


def extract_named_entities(text: str) -> Dict[str, List[str]]:
    """
    Extract named entities from text grouped by category.

    Args:
        text (str): Input text.

    Returns:
        Dict[str, List[str]]: Dictionary with keys 'people', 'organizations', 'locations'.
    """
    doc = nlp(text)
    entities = {key: [] for key in ENTITY_LABELS}

    for ent in doc.ents:
        for category, labels in ENTITY_LABELS.items():
            if ent.label_ in labels:
                entities[category].append(ent.text)

    return {k: _deduplicate(v) for k, v in entities.items()}


def extract_entity_relationships(text: str, scope: str = "sentence") -> List[Tuple[str, str, str]]:
    """
    Extract co-occurrence relationships between entities in a text.

    Args:
        text (str): Input text.
        scope (str): Granularity of relation detection ('sentence' or 'paragraph').

    Returns:
        List[Tuple[str, str, str]]: List of triples (entity1, "co_occurs_with", entity2).
    """
    doc = nlp(text)
    relations: Set[Tuple[str, str, str]] = set()

    if scope == "sentence":
        segments = list(doc.sents)
    elif scope == "paragraph":
        segments = [nlp(p) for p in text.split("\n\n")]
    else:
        raise ValueError("Unsupported scope. Use 'sentence' or 'paragraph'.")

    for segment in segments:
        entities = _deduplicate([
            ent.text for ent in segment.ents
            if ent.label_ in ENTITY_LABELS["people"] |
                              ENTITY_LABELS["organizations"] |
                              ENTITY_LABELS["locations"]
        ])
        for i in range(len(entities)):
            for j in range(i + 1, len(entities)):
                e1, e2 = sorted((entities[i], entities[j]))
                relations.add((e1, "co_occurs_with", e2))

    return list(relations)


def build_networkx_graph(triples: List[Tuple[str, str, str]]) -> nx.Graph:
    """
    Convert triples into a NetworkX undirected graph.

    Args:
        triples (List[Tuple[str, str, str]]): List of (entity1, relation, entity2)

    Returns:
        nx.Graph: A graph representing entities and their relationships.
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

    Args:
        triples (List[Tuple[str, str, str]]): Entity relationships.

    Returns:
        List[str]: List of Cypher MERGE queries.
    """
    def escape(text: str) -> str:
        return text.replace("'", "\\'")

    return [
        (
            f"MERGE (a:Entity {{name: '{escape(e1)}'}}) "
            f"MERGE (b:Entity {{name: '{escape(e2)}'}}) "
            f"MERGE (a)-[:{relation.upper()}]->(b)"
        )
        for e1, relation, e2 in triples
    ]


def _deduplicate(items: List[str]) -> List[str]:
    """
    Remove duplicates while preserving order.

    Args:
        items (List[str]): Input list.

    Returns:
        List[str]: Deduplicated list.
    """
    seen = set()
    return [x for x in items if not (x in seen or seen.add(x))]