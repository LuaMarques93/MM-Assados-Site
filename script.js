let cart = [];

function addToCart(name, price) {
    const existingItemIndex = cart.findIndex(item => item.name === name);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        const item = { name, price: parseFloat(price), quantity: 1 };
        cart.push(item);
    }
    renderCart();
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.innerHTML = `
            ${item.quantity}x ${item.name} - R$${(item.price * item.quantity).toFixed(2)} 
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
    const additionalInfo = document.getElementById('additional-info').value;
    const troco = document.getElementById('troco').value;

    let message = `Olá, gostaria de fazer um pedido:\n\n`;

    cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - R$${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const total = subtotal.toFixed(2); // Sem taxa adicional

    message += `\nSubtotal: R$${subtotal.toFixed(2)}`;
    message += `\nTotal: R$${total}`;
    message += `\n\nNome: ${name}`;
    message += `\nTelefone: ${phone}`;
    message += `\nEndereço: ${address}`;
    message += `\nForma de Pagamento: ${paymentMethod}`;
    
    if (paymentMethod === 'dinheiro' && troco) {
        message += `\nTroco para: R$${parseFloat(troco).toFixed(2)}`;
    }

    message += `\nInformações adicionais: ${additionalInfo}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=+5566999043248&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const menuItem = button.closest('.menu-item');
        const name = menuItem.getAttribute('data-name');
        const price = menuItem.getAttribute('data-price');
        addToCart(name, price);
    });
});
