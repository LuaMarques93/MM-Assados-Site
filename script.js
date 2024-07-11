let cart = [];

function addToCart(name, price) {
    const item = { name, price: parseFloat(price) };
    cart.push(item);
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - R$${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
        subtotal += item.price;
    });

    const subtotalElement = document.getElementById('subtotal');
    subtotalElement.textContent = subtotal.toFixed(2);

    const totalElement = document.getElementById('total');
    totalElement.textContent = (subtotal * 1.0).toFixed(2); // Assuming 10% tax or additional charges
}

function checkout() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const additionalInfo = document.getElementById('additional-info').value;

    let message = `Olá, gostaria de fazer um pedido:\n\n`;

    cart.forEach(item => {
        message += `${item.name} - R$${item.price.toFixed(2)}\n`;
    });

    const subtotal = cart.reduce((total, item) => total + item.price, 0);
    const total = (subtotal * 1.0).toFixed(2); // Assuming 10% tax or additional charges

    message += `\nSubtotal: R$${subtotal.toFixed(2)}`;
    message += `\nTotal: R$${total}`;
    message += `\n\nNome: ${name}`;
    message += `\nTelefone: ${phone}`;
    message += `\nEndereço: ${address}`;
    message += `\nForma de Pagamento: ${paymentMethod}`;
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
