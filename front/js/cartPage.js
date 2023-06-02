const cart = getCart();

if (cart.length > 0) {
    const section = document.getElementById('cart__items');
    let idCounter = 1; // Compteur pour générer des identifiants uniques

    cart.forEach((item) => {
        fetchFromApi(`${item.id}`)
            .then((data) => {
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

                // Changement de la quantité
                const quantityInput = article.querySelector('.itemQuantity');
                if (quantityInput) {
                    quantityInput.addEventListener('change', (() => {
                        const uniqueId = article.getAttribute('data-unique-id'); // Récupérer l'identifiant unique
                        const id = item.id;
                        const color = item.color;
                        return () => {
                            const quantity = quantityInput.value;
                            addToCart(id, quantity, color);
                            // Mise à jour du prix total
                            fetchFromApi(`${id}`).then((data) => {
                                const totalPrice = quantity * data.price;
                                document.getElementById(`totalPrice-${uniqueId}`).innerHTML = totalPrice.toLocaleString("fr-FR", {
                                    style: "currency",
                                    currency: 'EUR'
                                });
                            }).catch((error) => {
                                console.log(error);
                                window.alert('Une erreur est survenue, veuillez réessayer plus tard.');
                            });
                        };
                    })());
                }

                // Suppression d'un produit
                const deleteItemBtn = article.querySelector('.deleteItem');
                if (deleteItemBtn) {
                    deleteItemBtn.addEventListener('click', (() => {
                        const uniqueId = article.getAttribute('data-unique-id'); // Récupérer l'identifiant unique
                        const id = item.id;
                        const color = item.color;
                        return () => {
                            removeFromCart(id, color);
                            article.remove();
                        };
                    })());
                }

                section.appendChild(article);
                idCounter++; // Incrémenter le compteur d'identifiants uniques
            })
            .catch((error) => {
                console.log(error);
                window.alert('Une erreur est survenue, veuillez réessayer plus tard.');
            });
    });
}

const buyBtn = document.getElementById('order');
if (buyBtn) {
    buyBtn.addEventListener('click', (() => {
        const cart = getCart();
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

            if (contact.email === '' || contact.firstName === '' || contact.lastName === '' || contact.address === '' || contact.city === '') {
                window.alert('Veuillez remplir tous les champs.');
            } else if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/.test(contact.email) === false) {
                window.alert('Veuillez entrer une adresse email valide.');
            } else {
                const products = [];
                cart.forEach((item) => {
                    for (let i = 0; i < item.quantity; i++) {
                        products.push(item.id);
                    }
                });
                const order = {
                    contact,
                    products
                };
                console.log(order);
                sendOrderToApi(order).then((data) => {
                    window.location.href = `confirmation.html?orderId=${data.orderId}`;
                }).catch((error) => {
                    console.log(error);
                    window.alert('Une erreur est survenue, veuillez réessayer plus tard.');
                });
            }
        }
    }));
}
