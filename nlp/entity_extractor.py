# obj01/nlp/entity_extractor.py

import spacy
from typing import List, Dict

nlp = spacy.load("en_core_web_sm")

def extract_named_entities(text: str) -> Dict[str, List[str]]:
    """
    Extracts people, organizations, and locations from input text.

    Args:
        text (str): The article text.

    Returns:
        Dict[str, List[str]]: A dictionary with keys 'people', 'organizations', and 'locations'.
    """
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

    # Deduplicate while preserving order
    for key in entities:
        seen = set()
        entities[key] = [x for x in entities[key] if not (x in seen or seen.add(x))]

    return entities