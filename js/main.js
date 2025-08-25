// ===== SLIDER FUNCTIONALITY =====
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

// Auto-slide every 5 seconds
setInterval(() => {
    plusSlides(1);
}, 5000);

// ===== CART FUNCTIONALITY =====
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Producto agregado al carrito');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Producto removido del carrito');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (parseFloat(item.price.replace(/[^\d]/g, '')) * item.quantity);
        }, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.account-cart a:last-child');
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            cartCount.innerHTML = `🛒 ${totalItems}`;
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
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

// Initialize cart
const cart = new ShoppingCart();

// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: 'BLACK HOODIE "22XCLUSIVE"',
        price: '85000',
        priceFormatted: '$85.000,00',
        image: 'img/blackhoodie.jpg',
        available: true,
        installments: '3 cuotas sin interés de $28.333,33'
    },
    {
        id: 2,
        name: 'REMERA NEGRA DOBLE MANGA PESADA "NO…"',
        price: '66000',
        priceFormatted: '$66.000,00',
        image: 'img/remeranegra.jpg',
        available: false,
        installments: '3 cuotas sin interés de $22.000,00'
    }
];

// ===== ADD EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Add click events to product buttons
    const productButtons = document.querySelectorAll('.producto button');
    
    productButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const product = products[index];
            
            if (product.available) {
                cart.addItem(product);
            } else {
                // Show waitlist notification
                cart.showNotification('Te has anotado en la lista de espera');
            }
        });
    });

    // Add hover effects to buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add search functionality
    const searchInput = document.querySelector('.search input');
    const searchButton = document.querySelector('.search button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

function performSearch() {
    const searchTerm = document.querySelector('.search input').value.trim();
    if (searchTerm) {
        cart.showNotification(`Buscando: ${searchTerm}`);
        // Here you would implement actual search functionality
    }
}

// ===== CSS ANIMATIONS =====
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
    
    .producto button:hover {
        background: #f0f0f0 !important;
        transform: scale(1.05);
        transition: all 0.2s ease;
    }
    
    .search button:hover {
        color: #ccc;
    }
    
    nav.main-nav a:hover {
        color: #ccc;
        border-bottom: 2px solid #ccc;
    }
`;
document.head.appendChild(style);
