// Estado interno del carrito de compras
let cart = [];

// IMPORTANTE: Pon aquí tu número de WhatsApp de atención al cliente
// Debe incluir el código de país sin espacios, símbolos ni el signo '+' (Ej: 521XXXXXXXXXX para México)
const WHATSAPP_PHONE = '5214447639566'; 

// NUEVA FUNCIÓN: Detecta el sabor seleccionado antes de agregar al carrito
function addToCartWithFlavor(productName, price, selectId) {
    const flavorSelect = document.getElementById(selectId);
    const selectedFlavor = flavorSelect.value;
    
    // Combinamos el nombre del modelo con su sabor/variedad
    const fullProductName = `${productName} (${selectedFlavor})`;

    // Lo enviamos a la función original del carrito
    addToCart(fullProductName, price);
}

// Función base para añadir artículos al carrito
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartUI();
    
    // Pequeño efecto dinámico al contador flotante del Navbar
    const cartBadge = document.getElementById('cart-count');
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
    }, 200);
}

// Cambiar cantidades (+1 / -1) desde el panel lateral
function changeQuantity(name, amount) {
    const item = cart.find(item => item.name === name);
    if (!item) return;

    item.quantity += amount;

    // Si llega a 0 se elimina automáticamente
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    updateCartUI();
}

// Actualizar la interfaz del carrito en tiempo real
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-message">Tu carrito está vacío.</p>';
        totalPriceElement.textContent = '$0.00';
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        // Escapamos comillas simples para evitar errores en el onclick
        const safeItemName = item.name.replace(/'/g, "\\'");

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span>${item.quantity}x - $${itemTotal.toFixed(2)}</span>
            </div>
            <div class="cart-item-actions">
                <button class="btn-qty" onclick="changeQuantity('${safeItemName}', -1)">-</button>
                <button class="btn-qty" onclick="changeQuantity('${safeItemName}', 1)">+</button>
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });

    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Desplegar/Esconder el panel lateral del carrito
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

// Construcción del mensaje estructurado y redirección a la API de WhatsApp
function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos antes de confirmar.');
        return;
    }

    // Estructura del mensaje de texto automático
    let message = '📱 *¡Hola Vapes el Fer! Me gustaría hacer el siguiente pedido:*\n\n';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `*${index + 1}.* ${item.quantity}x _${item.name}_ -> *$${itemTotal.toFixed(2)}*\n`;
    });

    message += `\n💰 *Total a Pagar:* $${total.toFixed(2)}\n`;
    message += `📍 _¿Me podrías indicar los detalles para el pago y la entrega?_`;

    // Codificación segura del texto para URLs
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

    // Abre una nueva pestaña enviando el pedido directamente
    window.open(whatsappUrl, '_blank');
}

// FUNCIONALIDAD DEL CARRUSEL DE PROMOS
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    let currentSlide = 0;
    const slideInterval = 4000; // Cambia cada 4 segundos

    function changeSlide() {
        if(slides.length === 0) return; // Validación por si no hay slides
        
        // Quita la clase activa del slide y punto actual
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        // Pasa al siguiente (y vuelve al inicio si llega al final)
        currentSlide = (currentSlide + 1) % slides.length;

        // Añade la clase activa al nuevo slide y punto
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    // Ejecuta la función en bucle
    if(slides.length > 0) {
        setInterval(changeSlide, slideInterval);
    }
});