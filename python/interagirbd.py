import sqlite3

# Connexion à la base de données
conn = sqlite3.connect('marketplace.db')
cursor = conn.cursor()

# Vérifier si la table existe
def table_existe():
    cursor.execute("""
        SELECT count(name) 
        FROM sqlite_master 
        WHERE type='table' AND name='listings'
    """)
    return cursor.fetchone()[0] == 1

# 1. Afficher tous les listings
def voir_tous_listings():
    if not table_existe():
        print("La table 'listings' n'existe pas encore. Veuillez d'abord exécuter facebook4.py pour scraper des données.")
        return
    cursor.execute('''
        SELECT * FROM listings
        LIMIT 10
    ''')
    for row in cursor.fetchall():
        print(f"ID: {row[0]}")
        print(f"Titre: {row[1]}")
        print(f"Prix: {row[2]}")
        print(f"Location: {row[3]}")
        print("------------------------")

# 2. Rechercher par prix maximum
def rechercher_par_prix_max(prix_max):
    if not table_existe():
        print("La table 'listings' n'existe pas encore. Veuillez d'abord exécuter facebook4.py pour scraper des données.")
        return []
    cursor.execute('''
        SELECT title, price, location 
        FROM listings 
        WHERE price <= ?
        ORDER BY price
    ''', (prix_max,))
    return cursor.fetchall()

# 3. Rechercher par location
def rechercher_par_location(location):
    if not table_existe():
        print("La table 'listings' n'existe pas encore. Veuillez d'abord exécuter facebook4.py pour scraper des données.")
        return []
    cursor.execute('''
        SELECT title, price, location 
        FROM listings 
        WHERE location LIKE ?
    ''', (f'%{location}%',))
    return cursor.fetchall()

# 4. Statistiques des prix
def statistiques_prix():
    if not table_existe():
        print("La table 'listings' n'existe pas encore. Veuillez d'abord exécuter facebook4.py pour scraper des données.")
        return
    cursor.execute('''
        SELECT 
            COUNT(*) as total,
            AVG(price) as moyenne,
            MIN(price) as minimum,
            MAX(price) as maximum
        FROM listings
        WHERE price > 0
    ''')
    stats = cursor.fetchone()
    if stats[0] > 0:
        print(f"Nombre total d'annonces: {stats[0]}")
        print(f"Prix moyen: {stats[1]:.2f}$")
        print(f"Prix minimum: {stats[2]}$")
        print(f"Prix maximum: {stats[3]}$")
    else:
        print("Aucune annonce avec un prix valide n'a été trouvée dans la base de données.")

# Exemple d'utilisation
try:
    while True:
        print("\nMenu:")
        print("1. Voir tous les listings")
        print("2. Rechercher par prix maximum")
        print("3. Rechercher par location")
        print("4. Voir les statistiques de prix")
        print("5. Quitter")
        
        choix = input("Choisissez une option (1-5): ")
        
        if choix == "1":
            voir_tous_listings()
        
        elif choix == "2":
            prix_max = float(input("Entrez le prix maximum: "))
            resultats = rechercher_par_prix_max(prix_max)
            for r in resultats:
                print(f"{r[0]} - {r[1]}$ - {r[2]}")
        
        elif choix == "3":
            location = input("Entrez la location à rechercher: ")
            resultats = rechercher_par_location(location)
            for r in resultats:
                print(f"{r[0]} - {r[1]}$ - {r[2]}")
        
        elif choix == "4":
            statistiques_prix()
        
        elif choix == "5":
            break
        
        else:
            print("Option invalide")

except Exception as e:
    print(f"Erreur: {e}")

finally:
    # Fermer la connexion
    conn.close()