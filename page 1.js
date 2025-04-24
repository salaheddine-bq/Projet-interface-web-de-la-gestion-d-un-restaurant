// Variables pour le panier
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartDiv = document.getElementById('cart');

// Fonction pour sauvegarder le panier dans localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Ajouter un produit au panier
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.getAttribute('data-name');
        const productPrice = parseInt(button.getAttribute('data-price'));

        // Vérifier si le produit est déjà dans le panier
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        saveCartToLocalStorage(); // Sauvegarder les changements
        alert(`${productName} a été ajouté au panier.`);
        updateCartDisplay(); // Rafraîchir l'affichage
    });
});

// Fonction pour afficher le panier
function updateCartDisplay() {
    // Effacer le contenu précédent
    cartItemsContainer.innerHTML = '';

    // Remplir avec les nouveaux éléments
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} x ${item.quantity} = ${item.price * item.quantity}dh
            <button class="increase-quantity" data-index="${index}">+</button>
            <button class="decrease-quantity" data-index="${index}">-</button>
            <button class="remove-item" data-index="${index}">Supprimer</button>
        `;
        cartItemsContainer.appendChild(li);
        total += item.price * item.quantity;
    });

    // Mettre à jour le total
    totalPriceElement.textContent = `Total : ${total}dh`;

    // Ajouter les gestionnaires pour modifier la quantité
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            cart[index].quantity += 1; // Augmenter la quantité
            saveCartToLocalStorage(); // Sauvegarder les changements
            updateCartDisplay(); // Rafraîchir l'affichage
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1; // Diminuer la quantité
            } else {
                cart.splice(index, 1); // Supprimer si la quantité atteint 0
            }
            saveCartToLocalStorage(); // Sauvegarder les changements
            updateCartDisplay(); // Rafraîchir l'affichage
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            cart.splice(index, 1); // Supprimer l'élément du tableau
            alert('Article supprimé du panier.');
            saveCartToLocalStorage(); // Sauvegarder les changements
            updateCartDisplay(); // Rafraîchir l'affichage
        });
    });

    // Ajouter un bouton "Commander" en bas du panier
    let orderButton = document.getElementById('order-button');
    if (!orderButton) {
        orderButton = document.createElement('button');
        orderButton.id = 'order-button';
        orderButton.textContent = 'Commander';
        cartDiv.appendChild(orderButton);

        // Ajouter l'événement click au bouton
        orderButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Votre panier est vide.');
                return;
            }

            // Ajouter la commande dans localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push({ items: [...cart], date: new Date().toISOString() });
            localStorage.setItem('orders', JSON.stringify(orders));

            // Afficher un message de succès
            alert('Votre commande a été enregistrée avec succès.');

            // Vider le panier après la commande
            cart.length = 0;
            saveCartToLocalStorage();
            updateCartDisplay(); // Rafraîchir l'affichage
        });
    }
}

// Afficher ou masquer le panier
document.getElementById('view-cart').addEventListener('click', () => {
    if (cartDiv.style.display === 'block') {
        cartDiv.style.display = 'none'; // Masquer le panier si déjà visible
    } else {
        cartDiv.style.display = 'block'; // Afficher le panier si caché
        updateCartDisplay(); // Rafraîchir l'affichage
    }
});

// Charger le panier à partir de localStorage au démarrage
updateCartDisplay();
