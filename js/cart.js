// ===== CART PAGE FUNCTIONALITY =====

class CartPage {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [
            {
                id: 1,
                name: 'BLACK HOODIE "22XCLUSIVE"',
                price: '85000',
                priceFormatted: '$85.000,00',
                image: '../img/blackhoodie.jpg',
                available: true,
                installments: '3 cuotas sin interés de $28.333,33'
            },
            {
                id: 2,
                name: 'REMERA NEGRA DOBLE MANGA PESADA "NO…"',
                price: '66000',
                priceFormatted: '$66.000,00',
                image: '../img/remeranegra.jpg',
                available: false,
                installments: '3 cuotas sin interés de $22.000,00'
            }
        ];
        
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.renderCartItems();
        this.updateSummary();
        this.addEventListeners();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            cartCount.innerHTML = `🛒 ${totalItems}`;
        }
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');

        if (this.cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCart.style.display = 'block';
            return;
        }

        cartItemsContainer.style.display = 'block';
        emptyCart.style.display = 'none';

        cartItemsContainer.innerHTML = '';

        this.cart.forEach(item => {
            const product = this.products.find(p => p.id === item.id);
            if (product) {
                const cartItem = this.createCartItemElement(item, product);
                cartItemsContainer.appendChild(cartItem);
            }
        });
    }

    createCartItemElement(item, product) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.productId = item.id;

        const itemTotal = (parseFloat(product.price) * item.quantity).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS'
        });

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
                <h3>${product.name}</h3>
                <div class="price">${product.priceFormatted}</div>
                <div class="installments">${product.installments}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="cartPage.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                       onchange="cartPage.updateQuantity(${item.id}, parseInt(this.value))">
                <button class="quantity-btn" onclick="cartPage.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="item-total">${itemTotal}</div>
            <button class="remove-btn" onclick="cartPage.removeItem(${item.id})">Eliminar</button>
        `;

        return cartItem;
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCartItems();
            this.updateSummary();
            this.updateCartDisplay();
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartItems();
        this.updateSummary();
        this.updateCartDisplay();
        this.showNotification('Producto removido del carrito');
    }

    updateSummary() {
        const subtotal = this.cart.reduce((total, item) => {
            const product = this.products.find(p => p.id === item.id);
            return total + (parseFloat(product.price) * item.quantity);
        }, 0);

        const shipping = subtotal > 50000 ? 0 : 5000; // Envío gratis sobre $50.000
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('shipping').textContent = this.formatCurrency(shipping);
        document.getElementById('total').textContent = this.formatCurrency(total);

        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.disabled = this.cart.length === 0;
    }

    formatCurrency(amount) {
        return amount.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS'
        });
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addEventListeners() {
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Search functionality
        const searchInput = document.querySelector('.search input');
        const searchButton = document.querySelector('.search button');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', this.performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Newsletter subscription
        const newsletterInput = document.querySelector('.footer-newsletter input');
        const newsletterButton = document.querySelector('.footer-newsletter button');
        
        if (newsletterInput && newsletterButton) {
            newsletterButton.addEventListener('click', () => {
                this.subscribeNewsletter();
            });
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'error');
            return;
        }

        // Simulate checkout process
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.textContent = 'PROCESANDO...';
        checkoutBtn.disabled = true;

        setTimeout(() => {
            this.showNotification('Redirigiendo al checkout...', 'success');
            // Here you would redirect to actual checkout page
            // window.location.href = 'checkout.html';
        }, 2000);
    }

    performSearch() {
        const searchTerm = document.querySelector('.search input').value.trim();
        if (searchTerm) {
            this.showNotification(`Buscando: ${searchTerm}`);
            // Here you would implement actual search functionality
        }
    }

    subscribeNewsletter() {
        const email = document.querySelector('.footer-newsletter input').value.trim();
        if (email && this.isValidEmail(email)) {
            this.showNotification('¡Te has suscrito al newsletter!', 'success');
            document.querySelector('.footer-newsletter input').value = '';
        } else {
            this.showNotification('Por favor ingresa un email válido', 'error');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart page when DOM is loaded
let cartPage;
document.addEventListener('DOMContentLoaded', function() {
    cartPage = new CartPage();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .quantity-input::-webkit-inner-spin-button,
    .quantity-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    .quantity-input[type=number] {
        -moz-appearance: textfield;
    }
`;
document.head.appendChild(style);
