const API_URL = "http://localhost:3000/api/products/";

/**
 * Fait une requête à l'API et retourne les données
 * @param endpoint
 * @returns {Promise<any>}
 */
const fetchFromApi = (endpoint) => {
    return fetch(`${API_URL}${endpoint}`)
        .then((response) => response.json())
        .then((data) => (fetchData = data))
        .catch((error) => {
            console.log(error);
            window.alert("Erreur lors de la récupération des données");
        });
}
