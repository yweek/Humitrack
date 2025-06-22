#!/usr/bin/env python3
import requests
import json
import re
from typing import List, Dict

def extract_cigars_from_reddit():
    """
    Extrait les noms de cigares depuis r/cigars et les formate pour la base de données
    """
    
    # Headers pour éviter d'être bloqué
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # URLs Reddit à explorer
    urls = [
        "https://www.reddit.com/r/cigars/hot.json",
        "https://www.reddit.com/r/cigars/top.json",
        "https://www.reddit.com/r/cigars/new.json"
    ]
    
    cigar_names = []
    
    for url in urls:
        try:
            print(f"Tentative d'accès à {url}...")
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Extraire les titres et contenus des posts
                for post in data['data']['children']:
                    post_data = post['data']
                    title = post_data.get('title', '')
                    selftext = post_data.get('selftext', '')
                    
                    # Chercher des noms de cigares dans le titre et le contenu
                    cigar_matches = extract_cigar_names(title + " " + selftext)
                    cigar_names.extend(cigar_matches)
                    
            else:
                print(f"Erreur {response.status_code} pour {url}")
                
        except Exception as e:
            print(f"Erreur lors de l'accès à {url}: {e}")
    
    # Supprimer les doublons et formater
    unique_cigars = list(set(cigar_names))
    formatted_cigars = format_cigars_for_database(unique_cigars)
    
    return formatted_cigars

def extract_cigar_names(text: str) -> List[str]:
    """
    Extrait les noms de cigares depuis un texte
    """
    cigar_names = []
    
    # Patterns communs pour les noms de cigares
    patterns = [
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Cigar|Robusto|Churchill|Corona|Toro|Gordo|Lancero|Petit\s+Corona)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Series|Reserve|Limited|Special|Premium)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:No\.?\d+)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Maduro|Natural|Connecticut|Habano|Corojo)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Double|Triple|Single)\s+(?:Claro|Maduro|Natural)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Classic|Original|Vintage|Heritage)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Gold|Silver|Platinum|Diamond)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Red|Black|Blue|Green|White)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Monte|Cristo|Padron|Arturo|Fuente|Romeo|Julieta)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Cohiba|Hoyo|de\s+Monterrey|Partagas|H\s*Upmann)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Oliva|Rocky|Patel|Drew|Estate|Liga|Privada)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:My\s+Father|Perdomo|Camacho|Gurkha|Alec|Bradley)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Crowned|Heads|Foundation|Warped|Guardian|of\s+the\s+Farm)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Tatuaje|Illusione|Viaje|LAtelier|Lat56)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Caldwell|Long\s+Live\s+The\s+King|Eastern\s+Standard)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Undercrown|Undercrown\s+Shade|Undercrown\s+Maduro)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Flying\s+Pig|Feral|Pig|Liga\s+9|Liga\s+Unico)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Herrera|Esteli|Connecticut|Broadleaf|Corojo)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Serie|V|G|O|P|1964|1926|Family\s+Reserve)\b',
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Anniversary|Birthday|Holiday|Special|Edition)\b'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            if len(match.strip()) > 3:  # Éviter les mots trop courts
                cigar_names.append(match.strip())
    
    # Ajouter des noms de cigares connus s'ils apparaissent dans le texte
    known_cigars = [
        "Monte Cristo", "Cohiba", "Padron", "Arturo Fuente", "Romeo y Julieta",
        "Hoyo de Monterrey", "Partagas", "H. Upmann", "Oliva", "Rocky Patel",
        "Drew Estate", "Liga Privada", "My Father", "Perdomo", "Camacho",
        "Gurkha", "Alec Bradley", "Crowned Heads", "Foundation", "Warped",
        "Guardian of the Farm", "Tatuaje", "Illusione", "Viaje", "L'Atelier",
        "Caldwell", "Long Live The King", "Eastern Standard", "Undercrown",
        "Flying Pig", "Feral Pig", "Liga 9", "Liga Unico", "Herrera Esteli"
    ]
    
    for cigar in known_cigars:
        if cigar.lower() in text.lower():
            cigar_names.append(cigar)
    
    return cigar_names

def format_cigars_for_database(cigar_names: List[str]) -> List[Dict]:
    """
    Formate les noms de cigares pour la base de données, en filtrant les entrées non pertinentes
    """
    formatted_cigars = []
    
    # Liste de mots à exclure (trop génériques ou non pertinents)
    exclude_words = set([
        "very", "good", "This", "the", "He", "small", "could", "all", "day", "long", "Diet", "Dr", "Pepper", "stuff", "gave", "me", "on", "is", "and", "with", "from", "for", "just", "smoke", "smoking", "cigar", "cigars", "today", "tonight", "morning", "afternoon", "evening", "night", "first", "last", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "birthday", "anniversary", "review", "box", "band", "burn", "draw", "flavor", "flavours", "taste", "tasting", "notes", "profile", "construction", "ash", "wrapper", "binder", "filler", "blend", "edition", "special", "reserve", "series", "classic", "original", "vintage", "heritage", "gold", "silver", "platinum", "diamond", "red", "black", "blue", "green", "white", "pig", "feral", "flying", "unico", "liga", "no", "nicaraguan", "dominican", "honduran", "cuban", "connecticut", "maduro", "habano", "corojo", "broadleaf", "shade", "natural", "double", "triple", "single", "robusto", "toro", "gordo", "lancero", "churchill", "corona", "petit", "monte", "cristo", "padron", "arturo", "fuente", "romeo", "julieta", "cohiba", "hoyo", "de", "monterrey", "partagas", "h", "upmann", "oliva", "rocky", "patel", "drew", "estate", "my", "father", "perdomo", "camacho", "gurkha", "alec", "bradley", "crowned", "heads", "foundation", "warped", "guardian", "of", "the", "farm", "tatuaje", "illusione", "viaje", "latelier", "caldwell", "long", "live", "king", "eastern", "standard", "undercrown", "herrera", "esteli", "serie", "v", "g", "o", "p", "1964", "1926", "family", "reserve", "anniversary", "holiday", "special", "edition"
    ])

    # Marques connues (pour filtrage)
    brands = [
        "Monte Cristo", "Cohiba", "Padron", "Arturo Fuente", "Romeo y Julieta",
        "Hoyo de Monterrey", "Partagas", "H. Upmann", "Oliva", "Rocky Patel",
        "Drew Estate", "Liga Privada", "My Father", "Perdomo", "Camacho",
        "Gurkha", "Alec Bradley", "Crowned Heads", "Foundation", "Warped",
        "Guardian of the Farm", "Tatuaje", "Illusione", "Viaje", "L'Atelier",
        "Caldwell", "Long Live The King", "Eastern Standard", "Undercrown",
        "Flying Pig", "Feral Pig", "Liga 9", "Liga Unico", "Herrera Esteli"
    ]
    
    for name in cigar_names:
        # Nettoyage
        name_clean = name.strip()
        # Doit contenir au moins deux mots
        if len(name_clean.split()) < 2:
            continue
        # Exclure si un mot du nom est dans la liste d'exclusion
        if any(word.lower() in exclude_words for word in name_clean.lower().split()):
            continue
        # Garder si une marque connue est dans le nom
        if not any(brand.lower() in name_clean.lower() for brand in brands):
            continue
        # Filtrer les noms trop courts
        if len(name_clean) <= 3:
            continue
        cigar_data = {
            "name": name_clean,
            "brand": extract_brand(name_clean),
            "origin": "Dominican Republic",  # Valeur par défaut
            "strength": "Medium",  # Valeur par défaut
            "wrapper": "Natural",  # Valeur par défaut
            "binder": "Dominican",  # Valeur par défaut
            "filler": "Dominican",  # Valeur par défaut
            "price_range": "$$",  # Valeur par défaut
            "rating": 4.0,  # Valeur par défaut
            "description": f"Premium {name_clean} cigar with excellent construction and flavor profile.",
            "image_url": "",  # À remplir plus tard
            "category": "Premium"
        }
        formatted_cigars.append(cigar_data)
    
    return formatted_cigars

def extract_brand(name: str) -> str:
    """
    Extrait le nom de la marque depuis le nom du cigare
    """
    # Marques connues
    brands = [
        "Monte Cristo", "Cohiba", "Padron", "Arturo Fuente", "Romeo y Julieta",
        "Hoyo de Monterrey", "Partagas", "H. Upmann", "Oliva", "Rocky Patel",
        "Drew Estate", "Liga Privada", "My Father", "Perdomo", "Camacho",
        "Gurkha", "Alec Bradley", "Crowned Heads", "Foundation", "Warped",
        "Guardian of the Farm", "Tatuaje", "Illusione", "Viaje", "L'Atelier",
        "Caldwell", "Long Live The King", "Eastern Standard", "Undercrown",
        "Flying Pig", "Feral Pig", "Liga 9", "Liga Unico", "Herrera Esteli"
    ]
    
    for brand in brands:
        if brand.lower() in name.lower():
            return brand
    
    # Si aucune marque connue n'est trouvée, prendre le premier mot
    words = name.split()
    return words[0] if words else "Unknown"

def save_to_file(cigars: List[Dict], filename: str = "extracted_cigars.json"):
    """
    Sauvegarde les cigares extraits dans un fichier JSON
    """
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(cigars, f, indent=2, ensure_ascii=False)
    
    print(f"✅ {len(cigars)} cigares extraits et sauvegardés dans {filename}")

if __name__ == "__main__":
    print("🚬 Extraction des cigares depuis Reddit...")
    cigars = extract_cigars_from_reddit()
    
    if cigars:
        save_to_file(cigars)
        print(f"\n📋 Exemples de cigares extraits:")
        for i, cigar in enumerate(cigars[:10]):
            print(f"  {i+1}. {cigar['name']} ({cigar['brand']})")
    else:
        print("❌ Aucun cigare extrait. Vérifiez la connexion internet et les permissions Reddit.") 