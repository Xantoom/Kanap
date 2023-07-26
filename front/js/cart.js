/**
 * Récupère le panier depuis le localStorage
 * @returns {any}
 */
const getCart = () => {
    if(localStorage.getItem('cart')!= null) return JSON.parse(localStorage.getItem('cart'));
    else return [];
};

/**
 * Enregistre le panier dans le localStorage
 * @param cart
 */
const setCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

/**
 * Ajoute un produit au panier
 * @param id
 * @param quantity
 * @param color
 */
function addToCart (id, quantity, color) {
    const cart = getCart();

    const itemIndex = cart.findIndex((item) => item.id === id && item.color === color);

    if (itemIndex !== -1) {
        // Si l'article existe déjà dans le panier, ajouter la quantité spécifiée à la quantité existante
        cart[itemIndex].quantity += parseInt(quantity);
    } else {
        // Si l'article n'existe pas dans le panier, l'ajouter en tant que nouvel article
        cart.push({ id, quantity: parseInt(quantity), color });
    }

    setCart(cart);
}

function updateCart(id, quantity, color) {
    const cart = getCart();

    const itemIndex = cart.findIndex((item) => item.id === id && item.color === color);

    if (itemIndex !== -1) {
        // Si l'article existe déjà dans le panier, ajouter la quantité spécifiée à la quantité existante
        cart[itemIndex].quantity = parseInt(quantity);
        setCart(cart);
    }
}



/**
 * Supprime un produit du panier
 * @param id
 * @param color
 */
const removeFromCart = (id, color) => {
    const cart = getCart();

    const item = cart.find((item) => item.id === id && item.color === color);

    if (item) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
    }

    setCart(cart);
};

/**
 * Vide le panier
 */
const clearCart = () => {
    window.localStorage.removeItem('cart');
}
