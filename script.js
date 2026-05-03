/*
  Project: E-Commerce Product Page
  Author: Omkar R. Ghare

  Description:
  Handles interactivity such as navigation toggle, animations,
  and dynamic content updates.

  © 2026 Omkar R. Ghare. All rights reserved.

  Licensed under the MIT License.
*/

// ==================== STATE MANAGEMENT ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Product data
const product = {
    id: 'pwh-2024',
    name: 'Premium Wireless Headphones',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    selectedColor: 'black',
    selectedSize: 'standard',
    quantity: 1
};

// ==================== DOM ELEMENTS ====================
const themeToggle = document.getElementById('theme-toggle');
const cartBtn = document.getElementById('cart-btn');
const wishlistBtn = document.getElementById('wishlist-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const addToCartBtn = document.getElementById('add-to-cart');
const buyNowBtn = document.getElementById('buy-now');
const qtyInput = document.getElementById('qty-input');
const qtyIncrease = document.getElementById('qty-increase');
const qtyDecrease = document.getElementById('qty-decrease');
const colorOptions = document.querySelectorAll('.color-option');
const sizeOptions = document.querySelectorAll('.size-option');
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-image');
const productWishlist = document.getElementById('product-wishlist');
const tabBtns = document.querySelectorAll('.tab-btn');
const zoomBtn = document.getElementById('zoom-btn');
const zoomModal = document.getElementById('zoom-modal');
const closeZoom = document.getElementById('close-zoom');
const zoomedImage = document.getElementById('zoomed-image');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateCartUI();
    updateWishlistUI();
    checkIfInWishlist();
});

// ==================== THEME TOGGLE ====================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ==================== QUANTITY CONTROLS ====================
qtyIncrease.addEventListener('click', () => {
    let value = parseInt(qtyInput.value);
    if (value < 10) {
        qtyInput.value = value + 1;
        product.quantity = value + 1;
    }
});

qtyDecrease.addEventListener('click', () => {
    let value = parseInt(qtyInput.value);
    if (value > 1) {
        qtyInput.value = value - 1;
        product.quantity = value - 1;
    }
});

qtyInput.addEventListener('change', (e) => {
    let value = parseInt(e.target.value);
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    e.target.value = value;
    product.quantity = value;
});

// ==================== COLOR & SIZE SELECTION ====================
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        product.selectedColor = option.getAttribute('data-color');
        document.getElementById('selected-color').textContent = 
            product.selectedColor.charAt(0).toUpperCase() + product.selectedColor.slice(1);
    });
});

sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        sizeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        product.selectedSize = option.getAttribute('data-size');
        document.getElementById('selected-size').textContent = 
            option.textContent;
    });
});

// ==================== IMAGE GALLERY ====================
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
        const newImage = thumbnail.getAttribute('data-image');
        mainImage.src = newImage;
        product.image = newImage;
    });
});

// ==================== IMAGE ZOOM ====================
zoomBtn.addEventListener('click', () => {
    zoomedImage.src = mainImage.src;
    zoomModal.classList.add('show');
    document.body.style.overflow = 'hidden';
});

closeZoom.addEventListener('click', () => {
    zoomModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

zoomModal.addEventListener('click', (e) => {
    if (e.target === zoomModal) {
        zoomModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// ==================== TABS ====================
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Add active class to clicked tab
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// ==================== WISHLIST ====================
productWishlist.addEventListener('click', () => {
    toggleWishlist();
});

wishlistBtn.addEventListener('click', () => {
    if (wishlist.length > 0) {
        showToast('Wishlist feature - View your saved items!', 'info');
    } else {
        showToast('Your wishlist is empty', 'info');
    }
});

function toggleWishlist() {
    const productId = product.id;
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        productWishlist.querySelector('i').classList.remove('fas');
        productWishlist.querySelector('i').classList.add('far');
        showToast('Removed from wishlist', 'success');
    } else {
        // Add to wishlist
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        productWishlist.querySelector('i').classList.remove('far');
        productWishlist.querySelector('i').classList.add('fas');
        showToast('Added to wishlist!', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function checkIfInWishlist() {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
        productWishlist.querySelector('i').classList.remove('far');
        productWishlist.querySelector('i').classList.add('fas');
    }
}

function updateWishlistUI() {
    document.getElementById('wishlist-count').textContent = wishlist.length;
}

// ==================== CART FUNCTIONALITY ====================

// Add to Cart
addToCartBtn.addEventListener('click', () => {
    addToCart();
});

// Buy Now
buyNowBtn.addEventListener('click', () => {
    addToCart();
    setTimeout(() => {
        openCart();
    }, 500);
});

function addToCart() {
    const cartItem = {
        id: `${product.id}-${product.selectedColor}-${product.selectedSize}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.selectedColor,
        size: product.selectedSize,
        quantity: product.quantity
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += cartItem.quantity;
        showToast(`Updated quantity in cart`, 'success');
    } else {
        // Add new item
        cart.push(cartItem);
        showToast('Added to cart!', 'success');
    }
    
    saveCart();
    updateCartUI();
    renderCart();
}

// Open/Close Cart
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);
document.getElementById('close-empty-cart').addEventListener('click', closeCartSidebar);

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Update Cart Count
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    renderCart();
}

// Render Cart Items
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-primary" id="close-empty-cart">Continue Shopping</button>
            </div>
        `;
        document.getElementById('close-empty-cart').addEventListener('click', closeCartSidebar);
        updateCartTotals();
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-options">
                    <span>Color: ${item.color}</span>
                    <span>Size: ${item.size}</span>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="qty-btn-small" onclick="updateCartQuantity('${item.id}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn-small" onclick="updateCartQuantity('${item.id}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    updateCartTotals();
}

// Update Cart Quantity (Global function)
function updateCartQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Remove from Cart (Global function)
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
    showToast('Item removed from cart', 'success');
}

// Update Cart Totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout Button
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    showToast('Redirecting to checkout...', 'info');
    setTimeout(() => {
        alert('Checkout functionality would be implemented here!');
    }, 1000);
});

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== SHARE BUTTONS ====================
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.querySelector('i').classList[1].split('-')[1];
        showToast(`Sharing on ${platform}...`, 'info');
    });
});

// ==================== MOBILE MENU ====================
mobileMenuBtn.addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('mobile-open');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav').classList.remove('mobile-open');
    });
});

// ==================== HELPFUL REVIEWS ====================
document.querySelectorAll('.helpful-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast('Thank you for your feedback!', 'success');
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Esc to close cart/zoom
    if (e.key === 'Escape') {
        closeCartSidebar();
        zoomModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Ctrl/Cmd + K to open cart
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCart();
    }
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-info, .product-tabs').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});