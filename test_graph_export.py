# test_graph_export.py

from nlp.entity_extractor import (
    extract_entity_relationships,
    build_networkx_graph,
    export_triples_as_cypher
)

sample_text = """
President Joe Biden met with executives from Apple and Google in Washington D.C. on Monday.
Elon Musk and Bill Gates also attended the event.
"""

triples = extract_entity_relationships(sample_text)
print("Triples:")
for t in triples:
    print(t)

print("\nCypher Export:")
for line in export_triples_as_cypher(triples):
    print(line)

print("\nNetworkX Graph:")
G = build_networkx_graph(triples)
print("Nodes:", G.nodes)
print("Edges with labels:")
for u, v, data in G.edges(data=True):
    print(f"{u} --[{data['label']}]--> {v}")