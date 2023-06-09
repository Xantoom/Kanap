/**
 * Récupérer le panier depuis le localStorage
 * @returns {Promise<void>}
 */
async function processCartItems() {
    const cart = await getCart();

    if (cart.length > 0) {
        await updateTotalPrice();
        const section = document.getElementById('cart__items');
        let idCounter = 1; // Compteur pour générer des identifiants uniques

        for (const item of cart) {
            const data = await fetchFromApi(`${item.id}`);
            const article = document.createElement('article');
            article.className = 'cart__item';
            article.setAttribute('data-id', item.id);
            article.setAttribute('data-color', item.color);
            article.setAttribute('data-unique-id', `${idCounter}`); // Identifiant unique
            article.innerHTML = `
                <div class="cart__item__img">
                    <img src="${data.imageUrl}" alt="Photographie de ${data.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${data.name}</h2>
                        <p>${item.color}</p>
                        <p id="totalPrice-${idCounter}">${(item.quantity * data.price).toLocaleString("fr-FR", {style: "currency", currency: 'EUR'})}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            `;

            // Mise à jour de la quantité
            updateQuantityInputListener(article, item);

            // Suppression d'un produit
            deleteItemListener(article, item);

            section.appendChild(article);
            idCounter++; // Incrémenter le compteur d'identifiants uniques
        }
    }
}

/**
 * Mise à jour du prix total
 */
async function updateTotalPrice() {
    const cart = await getCart();
    const totalQuantity = document.getElementById('totalQuantity');
    const totalPrice = document.getElementById('totalPrice');
    let total = 0;
    let quantity = 0;

    for (const item of cart) {
        quantity += item.quantity;
        const data = await fetchFromApi(`${item.id}`);
        total += item.quantity * data.price;
    }

    totalQuantity.innerHTML = quantity.toString();
    totalPrice.innerHTML = total.toLocaleString("fr-FR", {style: "currency", currency: 'EUR'});
}

/**
 * Mise à jour de la quantité
 */
function updateQuantityInputListener(article, item) {
    const quantityInput = article.querySelector('.itemQuantity');
    if (!quantityInput) return;

    quantityInput.addEventListener('change', async () => {
        const uniqueId = article.getAttribute('data-unique-id'); // Récupérer l'identifiant unique
        const id = item.id;
        const color = item.color;
        const quantity = quantityInput.value;

        await addToCart(id, quantity, color);

        // Mise à jour du prix total
        const data = await fetchFromApi(`${id}`);
        const totalPrice = quantity * data.price;

        document.getElementById(`totalPrice-${uniqueId}`).innerHTML = totalPrice.toLocaleString("fr-FR", {
            style: "currency",
            currency: 'EUR'
        });

        await updateTotalPrice();
    });
}

/**
 * Suppression d'un produit
 * @param article
 * @param item
 */
function deleteItemListener(article, item) {
    // Suppression d'un produit
    const deleteItemBtn = article.querySelector('.deleteItem');
    if (!deleteItemBtn) return;

    deleteItemBtn.addEventListener('click', async () => {
        const uniqueId = article.getAttribute('data-unique-id');
        const id = item.id;
        const color = item.color;

        await removeFromCart(id, color);
        article.remove();
        await updateTotalPrice();
    });
}

/**
 * Bouton pour commander
 */
const buyBtn = document.getElementById('order');
if (buyBtn) {
    buyBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const cart = await getCart();

        if (cart.length <= 0) {
            window.alert('Votre panier est vide.');
        } else {
            const contact = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                email: document.getElementById('email').value
            };

            if (Object.values(contact).some(value => value === '')) {
                window.alert('Veuillez remplir tous les champs.');
            } else if (/^\d/.test(contact.firstName)) {
                window.alert('Veuillez entrer un prénom valide.');
            } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/.test(contact.email)) {
                window.alert('Veuillez entrer une adresse email valide.');
            } else {
                const products = [];
                for (const item of cart) {
                    for (let i = 0; i < item.quantity; i++) {
                        products.push(item.id);
                    }
                }

                const order = { contact, products };
                const data = await sendOrderToApi(order);

                clearCart();

                window.location.href = `confirmation.html?orderId=${data.orderId}`;
            }
        }
    });
}

// Appel initial pour traiter les éléments du panier
window.addEventListener('DOMContentLoaded', async () => {
    await processCartItems();
});
