let cart = [];

function updateCartDisplay() {
    const cartCount = document.getElementById("cart-count");
    const totalPrice = document.getElementById("total-price");

    let totalItems = cart.length;
    let totalCost = cart.reduce((sum, item) => sum + item.price, 0);

    cartCount.textContent = totalItems;
    totalPrice.textContent = totalCost;
}

function addToCart(product) {
    const name = product.getAttribute("data-name");
    const price = parseInt(product.getAttribute("data-price"));
    const quantity = parseInt(product.querySelector(".product-quantity").value);
    const imgSrc = product.querySelector("img").src;

    for (let i = 0; i < quantity; i++) {
        cart.push({ name, price, imgSrc });
    }
    updateCartDisplay();
    saveCart();

    // Анімація "польоту" товару до кошика
    const itemToAnimate = product.cloneNode(true);
    itemToAnimate.classList.add("flying-item");
    itemToAnimate.style.left = `${product.offsetLeft}px`;
    itemToAnimate.style.top = `${product.offsetTop}px`;
    document.body.appendChild(itemToAnimate);

    setTimeout(() => {
        itemToAnimate.style.animation = "fly-to-cart 0.5s forwards";
    }, 0);

    setTimeout(() => {
        itemToAnimate.remove();
    }, 500);

    // Показати повідомлення
    showNotification("Товар додано до кошика!");
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 2000);
}

function renderCartItems() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total").querySelector("span");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Кошик порожній</p>";
        cartTotal.textContent = "0";
        return;
    }

    let totalCost = 0;
    cart.forEach((item, index) => {
        totalCost += item.price;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${item.imgSrc}" alt="${item.name}" style="width: 80px; height: auto; margin-right: 10px;">
                <p>${item.name} - ${item.price} грн</p>
            </div>
            <button class="remove-from-cart" data-index="${index}">Видалити</button>
        `;

        cartItem.querySelector(".remove-from-cart").addEventListener("click", (e) => {
            const index = parseInt(e.target.getAttribute("data-index"));
            if (index >= 0 && index < cart.length) {
                cart.splice(index, 1);
                renderCartItems();
                updateCartDisplay();
                saveCart();
            }
        });

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = totalCost;
}

function showProductsPage() {
    document.getElementById("products-page").style.display = "block";
    document.getElementById("cart-page").style.display = "none";
}

function showCartPage() {
    document.getElementById("products-page").style.display = "none";
    document.getElementById("cart-page").style.display = "block";
    renderCartItems();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const product = e.target.closest(".product");
            addToCart(product);
        });
    });

    document.getElementById("view-cart").addEventListener("click", showCartPage);
    document .getElementById("back-to-products").addEventListener("click", showProductsPage);
}); 