const API_URL = "http://localhost:3000/api/products/";

/**
 * Fait une requête à l'API et retourne les données
 * @param endpoint
 * @returns {Promise<any>}
 */
const fetchFromApi = async (endpoint) => {
    return (await fetch(`${API_URL}${endpoint}`)).json();
}

/**
 * Fait une requête pour envoyer les données de commande à l'API
 * @param order
 * @returns {Promise<any>}
*/
const sendOrderToApi = async (order) => {
    return (await fetch(`${API_URL}order`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order),
    })).json();
}
