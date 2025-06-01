# obj01/nlp/entity_extractor.py

import spacy
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
    """
    Extract co-occurring entity relationships from the text.

    Args:
        text (str): The article text.
        scope (str): Context scope for co-occurrence ('sentence' | 'paragraph')

    Returns:
        List[Tuple[str, str, str]]: Triples of co-occurring entities.
    """
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
        # Remove duplicates in a single segment
        entities = list(dict.fromkeys(entities))

        for i in range(len(entities)):
            for j in range(i + 1, len(entities)):
                e1, e2 = sorted((entities[i], entities[j]))
                relations.add((e1, "co_occurs_with", e2))

    return list(relations)