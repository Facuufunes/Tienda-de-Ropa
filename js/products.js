// ===== PRODUCTS PAGE FUNCTIONALITY =====

class ProductsPage {
    constructor() {
        this.currentFilter = 'all';
        this.products = [
            // Hoodies
            { id: 1, name: 'BLACK HOODIE "22XCLUSIVE"', price: '85000', priceFormatted: '$85.000,00', image: '../img/blackhoodie.jpg', category: 'hoodies', installments: '3 cuotas sin interés de $28.333,33' },
            { id: 2, name: 'GREY HOODIE "URBAN STYLE"', price: '78000', priceFormatted: '$78.000,00', image: '../img/blackhoodie.jpg', category: 'hoodies', installments: '3 cuotas sin interés de $26.000,00' },
            { id: 3, name: 'WHITE HOODIE "CLASSIC"', price: '72000', priceFormatted: '$72.000,00', image: '../img/blackhoodie.jpg', category: 'hoodies', installments: '3 cuotas sin interés de $24.000,00' },
            
            // Remeras
            { id: 4, name: 'REMERA NEGRA DOBLE MANGA PESADA "NO…"', price: '66000', priceFormatted: '$66.000,00', image: '../img/remeranegra.jpg', category: 'remeras', installments: '3 cuotas sin interés de $22.000,00' },
            { id: 5, name: 'REMERA BLANCA "BASIC"', price: '45000', priceFormatted: '$45.000,00', image: '../img/remeranegra.jpg', category: 'remeras', installments: '3 cuotas sin interés de $15.000,00' },
            { id: 6, name: 'REMERA GRIS "GRAPHIC DESIGN"', price: '58000', priceFormatted: '$58.000,00', image: '../img/remeranegra.jpg', category: 'remeras', installments: '3 cuotas sin interés de $19.333,33' },
            { id: 7, name: 'REMERA NEGRA "OVERSIZED"', price: '52000', priceFormatted: '$52.000,00', image: '../img/remeranegra.jpg', category: 'remeras', installments: '3 cuotas sin interés de $17.333,33' },
            
            // Jeans
            { id: 8, name: 'JEANS "SLIM FIT" AZUL', price: '95000', priceFormatted: '$95.000,00', image: '../img/blackhoodie.jpg', category: 'jeans', installments: '3 cuotas sin interés de $31.666,67' },
            { id: 9, name: 'JEANS "RELAXED FIT" NEGRO', price: '88000', priceFormatted: '$88.000,00', image: '../img/blackhoodie.jpg', category: 'jeans', installments: '3 cuotas sin interés de $29.333,33' },
            { id: 10, name: 'JEANS "MOM FIT" CLARO', price: '92000', priceFormatted: '$92.000,00', image: '../img/blackhoodie.jpg', category: 'jeans', installments: '3 cuotas sin interés de $30.666,67' },
            { id: 11, name: 'JEANS "WIDE LEG" AZUL OSCURO', price: '98000', priceFormatted: '$98.000,00', image: '../img/blackhoodie.jpg', category: 'jeans', installments: '3 cuotas sin interés de $32.666,67' }
        ];
        
        this.init();
    }

    init() {
        this.addEventListeners();
        this.updateCartDisplay();
    }

    addEventListeners() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target);
            });
        });

        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAddToCart(e.target);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search input');
        const searchBtn = document.querySelector('.search button');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Newsletter
        const newsletterBtn = document.getElementById('newsletter-btn');
        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', () => {
                this.handleNewsletter();
            });
        }
    }

    handleFilter(btn) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get category
        const category = btn.getAttribute('data-category');
        this.currentFilter = category;
        
        // Filter products
        this.filterProducts(category);
    }

    filterProducts(category) {
        const products = document.querySelectorAll('.producto');
        
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
                product.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                product.style.display = 'none';
            }
        });
    }

    handleAddToCart(btn) {
        const productId = parseInt(btn.getAttribute('data-product-id'));
        const product = this.products.find(p => p.id === productId);
        
        if (product) {
            // Add loading state
            btn.classList.add('loading');
            btn.textContent = 'AGREGANDO...';
            
            // Simulate loading
            setTimeout(() => {
                this.addToCart(product);
                btn.classList.remove('loading');
                btn.textContent = 'AGREGAR AL CARRITO';
            }, 500);
        }
    }

    addToCart(product) {
        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                priceFormatted: product.priceFormatted,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        this.updateCartDisplay();
        
        // Show notification
        this.showNotification('Producto agregado al carrito', 'success');
    }

    updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart icon
        const cartLink = document.querySelector('.account-cart a[href="cart.html"]');
        if (cartLink) {
            cartLink.textContent = `🛒 ${totalItems}`;
        }
    }

    performSearch() {
        const searchInput = document.querySelector('.search input');
        const query = searchInput.value.toLowerCase().trim();
        
        if (query) {
            const products = document.querySelectorAll('.producto');
            let foundCount = 0;
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                
                if (productName.includes(query)) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeInUp 0.6s ease-out';
                    foundCount++;
                } else {
                    product.style.display = 'none';
                }
            });
            
            if (foundCount > 0) {
                this.showNotification(`Se encontraron ${foundCount} productos`, 'success');
            } else {
                this.showNotification('No se encontraron productos', 'error');
            }
        } else {
            // If search is empty, show all products based on current filter
            this.filterProducts(this.currentFilter);
        }
    }

    handleNewsletter() {
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput) {
            const email = emailInput.value.trim();
            
            if (email && this.isValidEmail(email)) {
                // Store newsletter subscription
                const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [];
                if (!subscriptions.includes(email)) {
                    subscriptions.push(email);
                    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                }
                
                this.showNotification('¡Te has suscrito al newsletter!', 'success');
                emailInput.value = '';
            } else {
                this.showNotification('Por favor ingresa un email válido', 'error');
            }
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

// Initialize products page when DOM is loaded
let productsPage;
document.addEventListener('DOMContentLoaded', function() {
    productsPage = new ProductsPage();
});

// Add CSS for animations
const productsStyle = document.createElement('style');
productsStyle.textContent = `
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
`;
document.head.appendChild(productsStyle);
