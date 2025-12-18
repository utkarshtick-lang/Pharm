// ========================================
// SHREYA PHARMACY - UI COMPONENTS
// ========================================

// Product Grid Renderer
function renderProducts(filter = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid || !window.products) return;

    const filtered = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <span class="product-emoji">${product.icon}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="price-current">₹${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="price-original">₹${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="quick-view-btn" onclick="openProductModal(${product.id})">Quick View</button>
        </div>
      </div>
    </div>
  `).join('');

    // Re-init hover effects
    initProductCardEffects();
}

// Product card hover effects
function initProductCardEffects() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.add(product);
    }
}

// Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const content = modal.querySelector('.modal-content');

    // Update modal content
    content.querySelector('.product-category-badge').textContent = product.category;
    content.querySelector('.product-modal-title').textContent = product.name;
    content.querySelector('.product-modal-desc').textContent = product.description;
    content.querySelector('.price-current').textContent = `₹${product.price.toFixed(2)}`;
    content.querySelector('.price-original').textContent = product.originalPrice ? `₹${product.originalPrice.toFixed(2)}` : '';
    content.querySelector('.meta-sku').textContent = product.sku;
    content.querySelector('.meta-stock').textContent = product.inStock ? 'In Stock' : 'Out of Stock';
    content.querySelector('.meta-stock').className = `meta-stock ${product.inStock ? 'in-stock' : ''}`;

    // Set current product for add to cart
    modal.dataset.productId = productId;

    // Open modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Init 3D viewer if available
    if (window.Product3DViewer) {
        new Product3DViewer('product-3d-viewer');
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Cart Sidebar
function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

// Auth Modal
function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Auth tab switching
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });
}

// Password strength meter
function initPasswordStrength() {
    const passwordInput = document.getElementById('register-password');
    const strengthBar = document.querySelector('.strength-bar');

    if (!passwordInput || !strengthBar) return;

    passwordInput.addEventListener('input', () => {
        const value = passwordInput.value;
        let strength = 0;

        if (value.length >= 8) strength += 25;
        if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 25;
        if (/\d/.test(value)) strength += 25;
        if (/[^a-zA-Z0-9]/.test(value)) strength += 25;

        strengthBar.style.width = `${strength}%`;
        strengthBar.style.background = strength < 50 ? '#f87171' : strength < 75 ? '#fbbf24' : '#4ade80';
    });
}

// Filter buttons
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.category);
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            const name = card.querySelector('.product-name').textContent.toLowerCase();
            const category = card.dataset.category.toLowerCase();
            const match = name.includes(query) || category.includes(query);
            card.style.display = match ? '' : 'none';
        });
    });
}

// Quantity controls in modal
function initQuantityControls() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const input = document.querySelector('.qty-input');

    if (!minusBtn || !plusBtn || !input) return;

    minusBtn.addEventListener('click', () => {
        input.value = Math.max(1, parseInt(input.value) - 1);
    });

    plusBtn.addEventListener('click', () => {
        input.value = Math.min(99, parseInt(input.value) + 1);
    });
}

// Modal add to cart
function initModalAddToCart() {
    const addBtn = document.querySelector('.product-modal .add-to-cart-btn');
    const modal = document.getElementById('product-modal');

    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
        const productId = parseInt(modal.dataset.productId);
        const quantity = parseInt(document.querySelector('.qty-input').value);
        const product = products.find(p => p.id === productId);

        if (product) {
            cart.add(product, quantity);
            closeProductModal();
        }
    });
}

// Newsletter form
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.newsletter-input');

        if (input.value) {
            showToast('Thanks for subscribing! 🎉', 'success');
            input.value = '';
        }
    });
}

// Initialize all components
function initComponents() {
    renderProducts();
    initFilters();
    initSearch();
    initAuthTabs();
    initPasswordStrength();
    initQuantityControls();
    initModalAddToCart();
    initNewsletter();

    // Event listeners
    document.querySelector('.cart-btn')?.addEventListener('click', openCart);
    document.querySelector('.cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.querySelector('.auth-btn')?.addEventListener('click', openAuthModal);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAuthModal();
            closeProductModal();
        });
    });

    // Modal backdrop clicks
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            closeAuthModal();
            closeProductModal();
        });
    });

    // Load cart from storage
    cart.load();
}

window.initComponents = initComponents;
window.renderProducts = renderProducts;
window.addToCart = addToCart;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.openCart = openCart;
window.closeCart = closeCart;
