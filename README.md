# Objective Newsfeed — A Tool for Truth

## 🧭 Mission Statement

**Objective Newsfeed** is an open-source initiative to reclaim truth in journalism through technology. Our mission is to empower individuals with tools to **parse**, **translate**, **compare**, and **summarize** global news coverage from multiple sources — free from commercial, political, or algorithmic bias.

In an age where attention is commodified and truth is fragmented, this project seeks to restore **epistemic autonomy** by providing a transparent, programmable framework for media analysis. We believe that:
- **Truth should be verifiable.**
- **Bias should be visible.**
- **Understanding should be accessible.**

This project is for thinkers, tinkerers, researchers, and global citizens who want to explore world events from a higher perspective — one not rooted in ideology or sensationalism, but in structured comparison and quantified narrative analysis.

---

## 🧱 What This Project Does

- 🌍 **Scrapes** multilingual news articles from RSS feeds and APIs.
- 🌐 **Translates** content into a shared language using open models.
- 🧠 **Embeds** news content into vector databases for semantic comparison.
- 📊 **Scores** articles by topic similarity, sentiment, and narrative divergence.
- 🧾 **Summarizes** across multiple perspectives to surface convergences and contradictions.
- 🎥 **Outputs** daily news digests as video/audio or chatbot-ready summaries.
- 🕸️ **Builds** a knowledge graph over time to track unfolding stories and actors.

---

## 🔧 Tech Stack (Pluggable)

| Component         | Tool/Option                            |
|------------------|-----------------------------------------|
| Scraping         | `newspaper3k`, `feedparser`, `scrapy`   |
| Translation      | `Whisper`, `argos-translate`, `M2M100` |
| Embeddings       | `sentence-transformers`, `Ollama`, `HF` |
| Vector DB        | `ChromaDB`, `Qdrant`, `FAISS`           |
| Summarization    | `transformers`, `GPTQ`, `mixtral`       |
| RAG/Agents       | `LangChain`, `SmolAI`, `CLINe`          |
| TTS (optional)   | `Tortoise`, `Bark`, `OpenVoice`         |

---

## 💡 Why It Matters

Most people consume information through systems optimized for **engagement**, not **truth**. The result is a fractured public understanding of events, biased by platform incentives.

This project enables:
- 📚 Personal education on world events, free from clickbait.
- 🧪 Research-grade tooling for media literacy analysis.
- 🛠️ Open infrastructure for independent journalism and civic tools.

If you’ve ever felt overwhelmed by contradictory narratives, or unsure which sources to trust — this is your toolkit to cut through the noise.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/objective-newsfeed.git
cd objective-newsfeed

# Install Python dependencies
pip install -r requirements.txt

# Run the pipeline (basic mode)
python run_daily_pipeline.py