import sys
import re
import types

if sys.version_info >= (3, 13):
    # Create a dummy cgi module
    cgi_module = types.ModuleType('cgi')
    
    # Minimal implementation of cgi.escape
    def escape(s, quote=True):
        s = s.replace("&", "&amp;")  # Must be done first
        s = s.replace("<", "&lt;")
        s = s.replace(">", "&gt;")
        if quote:
            s = s.replace('"', "&quot;")
            s = s.replace("'", "&#x27;")
        return s
    
    cgi_module.escape = escape
    sys.modules['cgi'] = cgi_module

    # Patch feedparser's encodings module
    import feedparser.encodings
    feedparser.encodings.cgi = cgi_module