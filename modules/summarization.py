from transformers import pipeline
import nltk
from nltk.tokenize import sent_tokenize

# Download punkt tokenizer models
nltk.download('punkt')

def summarize(text, max_sentences=3):
    try:
        # Use a small, fast model for initial version
        summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        
        # Handle long articles with chunking
        chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
        summaries = []
        
        for chunk in chunks:
            summary = summarizer(chunk, max_length=150, min_length=30, do_sample=False)
            summaries.append(summary[0]['summary_text'])
        
        full_summary = " ".join(summaries)
        
        # Extract most important sentences
        sentences = sent_tokenize(full_summary)
        return " ".join(sentences[:max_sentences])
    
    except Exception as e:
        print(f"Summarization failed: {str(e)}")
        # Fallback to first 3 sentences
        return " ".join(sent_tokenize(text)[:3])