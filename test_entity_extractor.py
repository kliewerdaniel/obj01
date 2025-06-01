# test_entity_extractor.py

from nlp.entity_extractor import extract_named_entities, extract_entity_relationships

sample_text = """
President Joe Biden met with executives from Apple and Google in Washington D.C. on Monday.
Elon Musk and Bill Gates also attended the event.
"""

print("Named Entities:")
print(extract_named_entities(sample_text))

print("\nEntity Relationships:")
for triple in extract_entity_relationships(sample_text, scope="sentence"):
    print(triple)