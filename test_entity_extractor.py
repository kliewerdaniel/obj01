# test_entity_extractor.py

from nlp.entity_extractor import extract_named_entities

sample_text = """
President Joe Biden met with executives from Apple and Google in Washington D.C. on Monday
to discuss AI regulation. Elon Musk and Bill Gates also attended the event.
"""

entities = extract_named_entities(sample_text)
print(entities)