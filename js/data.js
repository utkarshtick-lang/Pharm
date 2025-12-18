// ========================================
// SHREYA PHARMACY - DATA LAYER
// ========================================

const products = [
    {
        id: 1,
        name: "NeuroMax Pro",
        category: "prescription",
        price: 89.99,
        originalPrice: 119.99,
        icon: "🧠",
        badge: "Best Seller",
        description: "Advanced cognitive enhancement formula for peak mental performance.",
        sku: "PHX-NMP-001",
        inStock: true,
        reviews: 248
    },
    {
        id: 2,
        name: "ImmunoBoost Ultra",
        category: "vitamins",
        price: 45.99,
        originalPrice: null,
        icon: "🛡️",
        badge: null,
        description: "Complete immune system support with 25 essential vitamins and minerals.",
        sku: "PHX-IBU-002",
        inStock: true,
        reviews: 182
    },
    {
        id: 3,
        name: "CardioVitalis",
        category: "prescription",
        price: 124.99,
        originalPrice: 149.99,
        icon: "❤️",
        badge: "New",
        description: "Advanced cardiovascular support for optimal heart health.",
        sku: "PHX-CVT-003",
        inStock: true,
        reviews: 156
    },
    {
        id: 4,
        name: "SleepSync Night",
        category: "otc",
        price: 34.99,
        originalPrice: null,
        icon: "🌙",
        badge: null,
        description: "Natural sleep aid for restful, rejuvenating sleep cycles.",
        sku: "PHX-SSN-004",
        inStock: true,
        reviews: 312
    },
    {
        id: 5,
        name: "FlexiJoint Plus",
        category: "wellness",
        price: 56.99,
        originalPrice: 69.99,
        icon: "🦴",
        badge: "Popular",
        description: "Joint mobility and flexibility support with glucosamine and chondroitin.",
        sku: "PHX-FJP-005",
        inStock: true,
        reviews: 198
    },
    {
        id: 6,
        name: "DigestiZyme Pro",
        category: "wellness",
        price: 38.99,
        originalPrice: null,
        icon: "🧬",
        badge: null,
        description: "Advanced digestive enzyme complex for optimal nutrient absorption.",
        sku: "PHX-DZP-006",
        inStock: true,
        reviews: 145
    },
    {
        id: 7,
        name: "VitaD3 Supreme",
        category: "vitamins",
        price: 24.99,
        originalPrice: 29.99,
        icon: "☀️",
        badge: null,
        description: "High-potency vitamin D3 for bone health and immune function.",
        sku: "PHX-VD3-007",
        inStock: true,
        reviews: 289
    },
    {
        id: 8,
        name: "AllerClear Max",
        category: "otc",
        price: 28.99,
        originalPrice: null,
        icon: "🌸",
        badge: "Seasonal",
        description: "24-hour allergy relief without drowsiness.",
        sku: "PHX-ACM-008",
        inStock: false,
        reviews: 176
    },
    {
        id: 9,
        name: "OmegaPure 3000",
        category: "vitamins",
        price: 42.99,
        originalPrice: 54.99,
        icon: "🐟",
        badge: "Premium",
        description: "Triple-strength omega-3 fish oil for heart and brain health.",
        sku: "PHX-OP3-009",
        inStock: true,
        reviews: 234
    },
    {
        id: 10,
        name: "PainRelief Gel",
        category: "otc",
        price: 19.99,
        originalPrice: null,
        icon: "💆",
        badge: null,
        description: "Fast-acting topical pain relief with cooling menthol.",
        sku: "PHX-PRG-010",
        inStock: true,
        reviews: 167
    },
    {
        id: 11,
        name: "BioProbiotic 50B",
        category: "wellness",
        price: 49.99,
        originalPrice: 59.99,
        icon: "🦠",
        badge: "Top Rated",
        description: "50 billion CFU probiotic blend with 15 strains for gut health.",
        sku: "PHX-BP5-011",
        inStock: true,
        reviews: 321
    },
    {
        id: 12,
        name: "StressZen Complex",
        category: "wellness",
        price: 36.99,
        originalPrice: null,
        icon: "🧘",
        badge: null,
        description: "Adaptogenic herbs for stress relief and mental clarity.",
        sku: "PHX-SZC-012",
        inStock: true,
        reviews: 198
    }
];

const testimonials = [
    {
        id: 1,
        text: "Absolutely revolutionary service! The interface is from the future and my medications arrive faster than ever.",
        author: "Sarah Mitchell",
        role: "Healthcare Provider",
        avatar: "👩‍💼",
        rating: 5
    },
    {
        id: 2,
        text: "As a wholesale customer, the bulk ordering system and dedicated account manager have transformed our operations.",
        author: "James Rodriguez",
        role: "Pharmacy Owner",
        avatar: "👨‍💼",
        rating: 5
    },
    {
        id: 3,
        text: "The prescription upload feature is so easy! I take a photo and my refills arrive like magic. Best pharmacy experience ever.",
        author: "Emily Chen",
        role: "Regular Customer",
        avatar: "👩",
        rating: 5
    }
];

// Cart State
const cart = {
    items: [],

    add(product, quantity = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.save();
        this.updateUI();
        showToast(`${product.name} added to cart!`, 'success');
    },

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateUI();
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
            this.updateUI();
        }
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    save() {
        localStorage.setItem('pharma_cart', JSON.stringify(this.items));
    },

    load() {
        const saved = localStorage.getItem('pharma_cart');
        if (saved) {
            this.items = JSON.parse(saved);
            this.updateUI();
        }
    },

    updateUI() {
        // Update cart count badge
        const countBadge = document.querySelector('.cart-count');
        if (countBadge) {
            countBadge.textContent = this.getCount();
            countBadge.style.display = this.getCount() > 0 ? 'flex' : 'none';
        }

        // Update cart items display
        const cartItemsEl = document.getElementById('cart-items');
        if (cartItemsEl) {
            if (this.items.length === 0) {
                cartItemsEl.innerHTML = `
          <div class="cart-empty">
            <span class="empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <a href="#products" class="shop-link">Start Shopping</a>
          </div>
        `;
            } else {
                cartItemsEl.innerHTML = this.items.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">₹${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="cart.remove(${item.id})">×</button>
          </div>
        `).join('');
            }
        }

        // Update total
        const totalEl = document.querySelector('.total-amount');
        if (totalEl) {
            totalEl.textContent = `₹${this.getTotal().toFixed(2)}`;
        }
    }
};

// Toast notification system
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s var(--ease-out) reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export for use in other modules
window.products = products;
window.testimonials = testimonials;
window.cart = cart;
window.showToast = showToast;
