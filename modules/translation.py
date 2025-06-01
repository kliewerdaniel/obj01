from transformers import pipeline
from pathlib import Path

MODEL_DIR = Path("models")
MODEL_DIR.mkdir(exist_ok=True)

# Translator cache
translators = {}

def get_translator(source_lang, target_lang="en"):
    cache_key = f"{source_lang}_{target_lang}"
    
    if cache_key not in translators:
        model_name = f"Helsinki-NLP/opus-mt-{source_lang}-{target_lang}"
        translators[cache_key] = pipeline("translation", model=model_name)
    
    return translators[cache_key]

def translate_article(article, target_lang="en"):
    if article['language'] == target_lang:
        return article['text']
    
    try:
        translator = get_translator(article['language'], target_lang)
        # Split text into chunks to avoid memory issues
        text_chunks = [article['text'][i:i+400] for i in range(0, len(article['text']), 400)]
        translated_chunks = [translator(chunk)[0]['translation_text'] for chunk in text_chunks]
        return " ".join(translated_chunks)
    except Exception as e:
        print(f"⚠️ Translation failed for {article['url']}: {str(e)}")
        return article['text']