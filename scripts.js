let cart = [];
let selectedCombo = null;

function addToCart(name, price, isCombo = false) {
    if (isCombo) {
        selectedCombo = { name, price };
        const modal = new bootstrap.Modal(document.getElementById('acompanhamentosModal'));
        modal.show();
    } else {
        const itemIndex = cart.findIndex(item => item.name === name);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += 1;
        } else {
            const item = { name, price: parseFloat(price), quantity: 1 };
            cart.push(item);
        }
        renderCart();
        renderCartModal();
        showConfirmation(name);
        updateCartCount();
    }
}

function selectAcompanhamentos(name, price) {
    selectedCombo = { name, price };
    const modal = new bootstrap.Modal(document.getElementById('acompanhamentosModal'));
    modal.show();
}

function confirmAcompanhamentos() {
    const form = document.getElementById('acompanhamentosForm');
    const selectedAcompanhamentos = Array.from(form.elements.acompanhamento)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const selectedBebida = form.elements.bebida.value;

    if (selectedAcompanhamentos.length !== 2 || !selectedBebida) {
        alert('Por favor, selecione 2 acompanhamentos e 1 bebida.');
        return;
    }

    const comboName = `${selectedCombo.name} com ${selectedAcompanhamentos.join(' e ')} e ${selectedBebida}`;
    addToCart(comboName, selectedCombo.price);
    selectedCombo = null;

    // Fechar o modal de acompanhamentos
    const modalElement = document.getElementById('acompanhamentosModal');
    const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
    if (bootstrapModal) {
        bootstrapModal.hide();
    } else {
        console.error('Modal não encontrado.');
    }
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
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

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('total').textContent = subtotal.toFixed(2);
    }
}

function renderCartModal() {
    const cartItemsModal = document.getElementById('cart-items-modal');
    if (cartItemsModal) {
        cartItemsModal.innerHTML = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `${item.quantity}x ${item.name} - R$${item.price.toFixed(2)} 
                <button class="remove-from-cart btn btn-link text-danger" onclick="removeFromCart(${index})">Remover</button>`;
            cartItemsModal.appendChild(li);
            subtotal += item.price * item.quantity;
        });

        document.getElementById('subtotal-modal').textContent = subtotal.toFixed(2);
        document.getElementById('total-modal').textContent = subtotal.toFixed(2);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    renderCartModal();
    updateCartCount();
}

function finalizeOrder() {
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
    const total = subtotal.toFixed(2);

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

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5566999043248&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function showConfirmation(name) {
    const alertContainer = document.getElementById('alert-container');
    const alertText = document.getElementById('alert-text');

    alertText.textContent = `${name} foi adicionado ao carrinho!`;
    alertContainer.style.display = 'flex';
    alertContainer.style.opacity = '1';

    setTimeout(() => {
        alertContainer.style.opacity = '0';
        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 500);
    }, 2000);
}

function closeAlert() {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.style.opacity = '0';
    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 500);
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

document.getElementById('payment-method').addEventListener('change', function() {
    const trocoSection = document.getElementById('troco-section');
    if (this.value === 'dinheiro') {
        trocoSection.style.display = 'block';
    } else {
        trocoSection.style.display = 'none';
    }
});

document.getElementById('openCartModal').addEventListener('click', () => {
    renderCartModal();
    new bootstrap.Modal(document.getElementById('cartModal')).show();
});

function contactWhatsApp() {
    const whatsappUrl = 'https://wa.me/5566999043248';
    window.open(whatsappUrl, '_blank');
}

function openCheckoutModal() {
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function checkStoreStatus() {
    const statusBox = document.getElementById('status-box');
    const statusText = document.getElementById('status-text');
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    // Verifica se é domingo e se a hora está entre 07:00 e 14:00
    if (currentDay === 0 && ((currentHour === 7 && currentMinutes >= 0) || (currentHour > 7 && currentHour < 14) || (currentHour === 14 && currentMinutes === 0))) {
        statusBox.classList.remove('status-closed');
        statusBox.classList.add('status-open');
        statusText.textContent = 'Aberto';
    } else {
        statusBox.classList.remove('status-open');
        statusBox.classList.add('status-closed');
        statusText.textContent = 'Fechado';
    }
}

// Chama a função para verificar o status quando a página carrega
window.onload = checkStoreStatus;
