// Récupère l'Id de la commande dans l'URL
let orderId = new URLSearchParams(window.location.search).get("orderId");

// Affiche le numéro de commande
document.getElementById("orderId").textContent = orderId;
