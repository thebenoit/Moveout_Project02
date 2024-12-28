import undetected_chromedriver as uc
from selenium.webdriver.chrome.service import Service
import time
import json
import requests
import urllib.parse
from gzip import decompress as decode

class Scraper:
    def __init__(self, connection_string, database_name, collection_name, progress_collection, base_url, proxy_config=None) -> None:
        """
        Initialise le scraper avec une configuration flexible
        """
        self.base_url = base_url
        
        # Configuration des proxies avec valeurs par défaut
        self.proxies = proxy_config or {
            'http': 'http://2dh0lrid:ae1hsoYLTkR7BBUv@proxy.proxy-cheap.com:31112',
            'https': 'http://2dh0lrid:ae1hsoYLTkR7BBUv@proxy.proxy-cheap.com:31112'
        }

        # Configuration du navigateur
        chrome_options = uc.ChromeOptions()
        chrome_options.add_argument('--ignore-ssl-errors=yes')
        chrome_options.add_argument('--ignore-certificate-errors')

        service = Service()  # Vous devrez spécifier le chemin du chromedriver si nécessaire

        self.driver = uc.Chrome(
            service=service,
            options=chrome_options,
            seleniumwire_options={'proxy': self.proxies}
        )

        # Configuration de la session requests
        self.session = requests.Session()
        self.session.proxies.update(self.proxies)
        self.session.verify = False
        
        # Configuration de la base de données
        self.bd = Bd(connection_string, database_name, collection_name, progress_collection)
        
    def configure_graphql(self, api_name, variables):
        """
        Configure les paramètres pour les requêtes GraphQL
        """
        self.graphql_api_name = api_name
        self.variables = variables
        
    def get_first_req(self, url, wait_time=15):
        """
        Obtient la première requête avec possibilité de personnaliser l'URL et le temps d'attente
        """
        self.driver.get(url)
        time.sleep(wait_time)

        for request in self.driver.requests:
            if request.response and "graphql" in request.url:
                resp_body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                resp_body = json.loads(resp_body)
                return request.headers.__dict__["_headers"], request.body, resp_body
                
        return None, None, None

    def load_headers(self, headers, api_name=None):
        """
        Charge les en-têtes avec possibilité de personnaliser l'API name
        """
        for key, value in headers:
            self.session.headers.update({key: value})
        
        if api_name:
            self.session.headers.update({"x-fb-friendly-name": api_name})

    def parse_payload(self, payload):
        """
        Parse le payload des requêtes
        """
        decoded_str = urllib.parse.unquote(payload.decode())
        return dict(urllib.parse.parse_qsl(decoded_str))

    def make_request(self, url, payload, max_retries=3):
        """
        Effectue une requête avec gestion des erreurs et retries
        """
        for _ in range(max_retries):
            try:
                response = self.session.post(url, data=urllib.parse.urlencode(payload))
                response.raise_for_status()
                return response.json()
            except Exception as e:
                print(f"Erreur lors de la requête: {e}")
                time.sleep(5)
        return None

    def cleanup(self):
        """
        Nettoie les ressources
        """
        if self.driver:
            self.driver.quit()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()
