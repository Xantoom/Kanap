const productId = new URLSearchParams(window.location.search).get("id");

if (!productId) window.alert("Aucun produit sélectionné");

/**
 * Récupère un produit depuis l'API et l'affiche
 */
fetchFromApi(productId).then((product) => {
    // Affichage du produit
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="Photo de ${product.altTxt}">`;
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;

    // Affichage des options
    document.getElementById("colors").innerHTML = product.colors.map((color) => `<option value="${color}">${color}</option>`).join("");
});

/**
 * Ajoute un produit au panier lors du clic sur le bouton
 */
document.getElementById("addToCartBtn").addEventListener("click", () => {
    const quantity = parseInt(document.getElementById("quantity").value);
    const color = document.getElementById("colors").value;

    if (quantity > 0 || quantity <= 100) {
        addToCart(productId, quantity, color);
        window.alert("Le produit a bien été ajouté au panier");
    } else window.alert("Veuillez sélectionner une quantité valide");
});
