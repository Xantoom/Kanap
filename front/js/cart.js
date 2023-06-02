/**
 * Récupère le panier depuis le localStorage
 * @returns {any}
 */
const getCart = () => {
    return JSON.parse(localStorage.getItem('cart') || []);
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
const addToCart = (id, quantity, color) => {
    const cart = getCart();

    const item = cart.find((item) => item.id === id && item.color === color);

    if (item) item.quantity = parseInt(quantity);
    else cart.push({ id, quantity, color });

    setCart(cart);
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
}

/**
 * Supprime tous les produits du panier
 */
const clearCart = () => {
    setCart([]);
}
