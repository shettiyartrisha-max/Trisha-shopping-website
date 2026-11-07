
// Select HTML Elements

const productGrid = document.getElementById("productGrid");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const cartButton = document.getElementById("cartButton");

const cartSidebar = document.getElementById("cartSidebar");

const closeCart = document.getElementById("closeCart");

const cartOverlay = document.getElementById("cartOverlay");

const cartCount = document.getElementById("cartCount");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const noProducts = document.getElementById("noProducts");


// Store Products and Cart

let products = [];

let cart = [];


// Format Price

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}


// Fetch Products from JSON File

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        console.error("Error:", error);

        productGrid.innerHTML =
            "<p>Unable to load products. Please try again.</p>";

    }

}


// Display Products Dynamically

function displayProducts(productList) {

    productGrid.innerHTML = "";

    noProducts.hidden = productList.length !== 0;

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ${"★".repeat(Math.round(product.rating))}
                    <span>${product.rating}/5</span>
                </div>

                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <button class="add-cart"
                        data-id="${product.id}">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        productGrid.appendChild(card);

    });

}


// Add Product to Cart

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}


// Update Cart Information

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty!</p>';

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>
                    ${formatPrice(item.price)}
                    × ${item.quantity}
                </p>

            </div>

            <button class="remove-item"
                data-id="${item.id}">
                ✕
            </button>

        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent = formatPrice(total);

}


// Remove Product from Cart

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    updateCart();

}


// Search Products

function searchProducts() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );

    });

    displayProducts(filteredProducts);

}


// Open Cart

function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

}


// Close Cart

function hideCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}


// Event Listeners

productGrid.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart");

    if (!button) return;

    const productId = Number(button.dataset.id);

    addToCart(productId);

    button.textContent = "Added ✓";

    setTimeout(() => {

        button.textContent = "Add to Cart";

    }, 1000);

});


cartItems.addEventListener("click", function(event) {

    const button = event.target.closest(".remove-item");

    if (!button) return;

    const productId = Number(button.dataset.id);

    removeFromCart(productId);

});


searchInput.addEventListener("input", searchProducts);

searchBtn.addEventListener("click", searchProducts);

cartButton.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", hideCart);


// Checkout Button

checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

        return;

    }

    alert(
        "Thank you for shopping with ShopZone! " +
        "Checkout functionality can be connected to a payment gateway."
    );

});


// Start Website

loadProducts();

updateCart();
