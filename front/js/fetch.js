const API_URL = "http://localhost:3000/api/products/";

/**
 * Fait une requête à l'API et retourne les données
 * @param endpoint
 * @returns {Promise<any>}
 */
const fetchFromApi = (endpoint) => {
    let fetchData;
    return fetch(`${API_URL}${endpoint}`)
        .then((response) => response.json())
        .then((data) => (fetchData = data))
        .catch((error) => {
            console.log(error);
            window.alert("Erreur lors de la récupération des données");
        });
}

/**
 * Fait une requête pour envoyer les données de commande à l'API
 * @param order
 * @returns {Promise<any>}
*/
const sendOrderToApi = (order) => {
    console.log(order);
    return fetch(`${API_URL}order`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order),
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
            window.alert("Erreur lors de l'envoi des données");
        });
}
