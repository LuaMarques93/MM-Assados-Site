document.addEventListener('DOMContentLoaded', function() {
    let cart = [];

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            let menuItem = this.closest('.menu-item');
            let itemName = menuItem.getAttribute('data-name');
            let itemPrice = parseFloat(menuItem.getAttribute('data-price'));

            let cartItem = cart.find(item => item.name === itemName);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
            }
            updateCart();
        });
    });

    function updateCart() {
        let cartItemsContainer = document.getElementById('cart-items');
        let cartItemsModalContainer = document.getElementById('cart-items-modal');
        cartItemsContainer.innerHTML = '';
        cartItemsModalContainer.innerHTML = '';

        let subtotal = 0;
        cart.forEach(item => {
            let li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = `${item.quantity}x ${item.name} - R$${(item.quantity * item.price).toFixed(2)}`;
            let removeButton = document.createElement('button');
            removeButton.textContent = 'Remover';
            removeButton.className = 'btn btn-danger btn-sm';
            removeButton.addEventListener('click', function() {
                removeFromCart(item.name);
            });
            li.appendChild(removeButton);

            let liModal = li.cloneNode(true);
            cartItemsContainer.appendChild(li);
            cartItemsModalContainer.appendChild(liModal);

            subtotal += item.quantity * item.price;
        });

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('total').textContent = subtotal.toFixed(2);
        document.getElementById('subtotal-modal').textContent = subtotal.toFixed(2);
        document.getElementById('total-modal').textContent = subtotal.toFixed(2);
    }

    function removeFromCart(itemName) {
        cart = cart.filter(item => item.name !== itemName);
        updateCart();
    }

    window.checkout = function() {
        let name = document.getElementById('name').value;
        let phone = document.getElementById('phone').value;
        let address = document.getElementById('address').value;
        let paymentMethod = document.getElementById('payment-method').value;

        if (!name || !phone || !address) {
            alert('Por favor, preencha todos os campos de contato e endereço.');
            return;
        }

        let whatsappMessage = `Nome: ${name}\nTelefone: ${phone}\nEndereço: ${address}\nForma de Pagamento: ${paymentMethod}\nPedido:\n`;
        let total = 0;
        cart.forEach(item => {
            total += item.quantity * item.price;
            whatsappMessage += `${item.quantity}x ${item.name} - R$${(item.quantity * item.price).toFixed(2)}\n`;
        });

        whatsappMessage += `Total: R$${total.toFixed(2)}`;
        let encodedMessage = encodeURIComponent(whatsappMessage);
        let whatsappURL = `https://wa.me/5566999043248?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
});
