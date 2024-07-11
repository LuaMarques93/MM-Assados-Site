let cart = [];

function addToCart(name, price) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        const item = { name, price: parseFloat(price), quantity: 1 };
        cart.push(item);
    }
    renderCart();
    showConfirmation(name);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.innerHTML = `${item.quantity}x ${item.name} - R$${item.price.toFixed(2)} 
            <button class="remove-from-cart" onclick="removeFromCart(${index})">Remover</button>`;
        cartItems.appendChild(li);
        subtotal += item.price * item.quantity;
    });

    const subtotalElement = document.getElementById('subtotal');
    subtotalElement.textContent = subtotal.toFixed(2);

    const totalElement = document.getElementById('total');
    totalElement.textContent = subtotal.toFixed(2); // Sem taxa adicional
}

function checkout() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const troco = paymentMethod === 'dinheiro' ? document.getElementById('troco').value : '';
    const additionalInfo = document.getElementById('additional-info').value;

    if (!name || !phone || !address || (paymentMethod === 'dinheiro' && !troco)) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    let message = `Olá, gostaria de fazer um pedido:\n\n`;

    cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - R$${item.price.toFixed(2)}\n`;
    });

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal.toFixed(2); // Sem taxa adicional

    message += `\nSubtotal: R$${subtotal.toFixed(2)}`;
    message += `\nTotal: R$${total}`;
    message += `\n\nNome: ${name}`;
    message += `\nTelefone: ${phone}`;
    message += `\nEndereço: ${address}`;
    message += `\nForma de Pagamento: ${paymentMethod}`;
    if (paymentMethod === 'dinheiro') {
        message += `\nTroco para: R$${parseFloat(troco).toFixed(2)}`;
    }
    message += `\nInformações adicionais: ${additionalInfo}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=+5566999043248&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function showConfirmation(name) {
    const confirmation = document.createElement('div');
    confirmation.classList.add('confirmation');
    confirmation.textContent = `${name} adicionado ao carrinho!`;
    document.body.appendChild(confirmation);

    setTimeout(() => {
        confirmation.remove();
    }, 3000);
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const menuItem = button.closest('.menu-item');
        const name = menuItem.getAttribute('data-name');
        const price = menuItem.getAttribute('data-price');
        addToCart(name, price);
    });
});

document.getElementById('payment-method').addEventListener('change', function() {
    const trocoSection = document.getElementById('troco-section');
    if (this.value === 'dinheiro') {
        trocoSection.style.display = 'block';
    } else {
        trocoSection.style.display = 'none';
    }
});
