// Sample Menu Data
const menuData = [
    // Appetizers
    {
        id: 1,
        name: "Bruschetta Trio",
        category: "appetizers",
        price: 8.99,
        description: "Crispy toasts with fresh tomato, basil, and garlic",
        emoji: "🥖"
    },
    {
        id: 2,
        name: "Spring Rolls",
        category: "appetizers",
        price: 7.99,
        description: "Fresh vegetable spring rolls with sweet chili sauce",
        emoji: "🥒"
    },
    {
        id: 3,
        name: "Buffalo Wings",
        category: "appetizers",
        price: 9.99,
        description: "Crispy wings with spicy buffalo sauce",
        emoji: "🍗"
    },
    
    // Main Courses
    {
        id: 4,
        name: "Grilled Salmon",
        category: "mains",
        price: 18.99,
        description: "Fresh salmon fillet with lemon butter sauce and vegetables",
        emoji: "🐟"
    },
    {
        id: 5,
        name: "Pasta Carbonara",
        category: "mains",
        price: 14.99,
        description: "Classic Italian pasta with bacon, egg, and parmesan",
        emoji: "🍝"
    },
    {
        id: 6,
        name: "Chicken Teriyaki",
        category: "mains",
        price: 15.99,
        description: "Grilled chicken breast with teriyaki glaze and rice",
        emoji: "🍗"
    },
    {
        id: 7,
        name: "Beef Steak",
        category: "mains",
        price: 22.99,
        description: "Prime cut ribeye steak with garlic butter",
        emoji: "🥩"
    },
    
    // Desserts
    {
        id: 8,
        name: "Chocolate Lava Cake",
        category: "desserts",
        price: 6.99,
        description: "Warm chocolate cake with molten center",
        emoji: "🍰"
    },
    {
        id: 9,
        name: "Cheesecake",
        category: "desserts",
        price: 5.99,
        description: "New York style cheesecake with berry compote",
        emoji: "🍰"
    },
    {
        id: 10,
        name: "Tiramisu",
        category: "desserts",
        price: 6.99,
        description: "Traditional Italian dessert with mascarpone and coffee",
        emoji: "🍮"
    },
    
    // Beverages
    {
        id: 11,
        name: "Iced Tea",
        category: "beverages",
        price: 2.99,
        description: "Refreshing homemade iced tea",
        emoji: "🧋"
    },
    {
        id: 12,
        name: "Fresh Lemonade",
        category: "beverages",
        price: 3.49,
        description: "Freshly squeezed lemonade",
        emoji: "🍋"
    },
    {
        id: 13,
        name: "Soft Drink",
        category: "beverages",
        price: 2.49,
        description: "Choice of cola, sprite, or orange",
        emoji: "🥤"
    },
    {
        id: 14,
        name: "Adobo Chicken",
        category: "mains",
        price: 15.99,
        description: "Tender chicken cooked in a savory adobo sauce",
        emoji: "🍽️"
    }
];


// Cart Array
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    displayMenu('all');
    setupEventListeners();
});

// Display menu items
function displayMenu(filter) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    const itemsToDisplay = filter === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === filter);

    itemsToDisplay.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item active';
        menuItem.innerHTML = `
            <div class="menu-item-image">${item.emoji}</div>
            <div class="menu-item-content">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-category">${item.category}</div>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-footer">
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuData.find(m => m.id === itemId);
    const existingItem = cart.find(c => c.id === itemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    displayCart();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            displayCart();
        }
    }
}

// Display cart items
function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `;
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    document.getElementById('checkoutBtn').disabled = false;
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Update checkout form summary
    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('nadinesCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('nadinesCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayMenu(this.dataset.filter);
        });
    });

    // Cart button
    document.getElementById('cartBtn').addEventListener('click', function() {
        displayCart();
        openModal('cartModal');
    });

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        closeModal('cartModal');
        openModal('checkoutModal');
    });

    // Close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });

    // Close checkout modal
    document.getElementById('closeCheckout').addEventListener('click', function() {
        closeModal('checkoutModal');
    });

    // Checkout form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });

    // Continue shopping button
    document.getElementById('continueShoppingBtn').addEventListener('click', function() {
        closeModal('successModal');
        cart = [];
        saveCart();
        updateCartCount();
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Place order
function placeOrder() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;

    // Validate form
    if (!fullName || !email || !phone || !address) {
        alert('Please fill in all required fields');
        return;
    }

    // Create order object
    const order = {
        id: 'ORD-' + Date.now(),
        customer: {
            name: fullName,
            email: email,
            phone: phone,
            address: address,
            notes: notes
        },
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: 5.00,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.00,
        timestamp: new Date().toISOString()
    };

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('nadinesOrders') || '[]');
    orders.push(order);
    localStorage.setItem('nadinesOrders', JSON.stringify(orders));

    // Log order confirmation
    console.log('Order Placed:', order);

    // Show success message
    closeModal('checkoutModal');
    openModal('successModal');

    // Reset form
    document.getElementById('checkoutForm').reset();
}

// Show notification
function showNotification(message) {
    // Simple notification (can be enhanced with a toast library)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// View all orders
console.log(JSON.parse(localStorage.getItem('nadinesOrders')));

// Clear orders
localStorage.removeItem('nadinesOrders');