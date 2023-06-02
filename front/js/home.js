const items = document.getElementById('items');

/**
 * Récupère les produits depuis l'API et les affiche
 * @returns {Promise<void>}
 */
const displayProducts = async () => {
    const products = await fetchFromApi("");
    products.forEach((product) => {
        items.innerHTML += `
            <a href="./product.html?id=${product._id}">
              <article>
                <img src="${product.imageUrl}" alt="Photo de ${product.name}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
              </article>
            </a>
        `;
    });
}

window.addEventListener('DOMContentLoaded', displayProducts);
