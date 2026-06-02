import { renderNavbar, renderFooter } from "./shared/layout.js";
import { addItemToCart, initializeAddToCartButtons, updateCartBadgeCount } from "./shared/cart-service.js";

// RENDER LAYOUT
renderNavbar();
renderFooter();

// INITIALIZE ICONS
lucide.createIcons();

let cartListItems = getCartFromLocal();
let allProducts = [];
let taxPercent = 10;
let shippingPercent = 10;
let orderSummary = {}

// RENDERING CART UI
if(cartListItems && cartListItems.length) {
    // RENDER CART UI IF CART HAS PRODUCTS
    document.getElementById("cartSection").insertAdjacentHTML("afterbegin", createCartUI());

    // RENDER CART LIST ITEMS
    fetch("../../data/all-products.json")
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            if(cartListItems && cartListItems.length) {
                renderCartPage(cartListItems, allProducts);
            }
    });
} else {
    renderEmptyCartUI();
}

function renderCartPage(cartList, allProductsList) {
    let matchingProducts = cartList.map(cartItem => allProductsList.find(product => product.id === Number(cartItem.productId)));
    if(cartList.length) {
        initializeSummaryValues();
        let cartListContainer = `
                <div class="cart-list-container" id="cartList">
                
                </div>
            `
        document.getElementById("cartContainer").insertAdjacentHTML("afterbegin", cartListContainer);
        for(let p of matchingProducts) {
            let itemQuantity = Number(cartListItems.find(i => p.id === Number(i.productId)).quantity);
            document.getElementById("cartList").insertAdjacentHTML("beforeend", createCartItem(p, itemQuantity));
            orderSummary.subTotal = getSubTotal(p, itemQuantity, true);
            orderSummary.totalLeafCount += (itemQuantity * p.leafCount);
        }
        document.getElementById("cartContainer").insertAdjacentHTML("beforeend", createOrderSummaryUI(orderSummary));
        setDeleteEvent();
        setIncreaseEvent();
        setDecrementEvent();
    } else {   
        renderEmptyCartUI();
    }
    updateCartBadgeCount();
    lucide.createIcons();
}

// LOCAL STORAGE MANIPULATION
function getCartFromLocal() {
    return JSON.parse(localStorage.getItem("cart"));
}

function setCartToLocal(cartList) {
    localStorage.setItem("cart", JSON.stringify(cartList));
}

function getMatchingProduct(id) {
    return allProducts.find(p => p.id === id);
}

function clearCartUI() {
    document.getElementById("cartContainer").innerHTML = "";
}

function initializeSummaryValues() {
    orderSummary = {
        subTotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        totalLeafCount: 0
    }
}

function getSubTotal(product, quantity, addCount) {
    let price = product.hasOffer ? product.discountPrice : product.actualPrice;
    let finalPrice = quantity * price;
    let subTotal = addCount ? (orderSummary.subTotal + finalPrice) : (orderSummary.subTotal - finalPrice);
    return Number(subTotal.toFixed(2));
}

// QUANTITY INCREASE AND DECREASE HELPER FUNCTIONS
// INCREMENT FUNCTIONS
function increaseItemCount(id) {
    addItemToCart(id, 1);
    let matchedProduct = getMatchingProduct(id);
    // orderSummary.subTotal = getSubTotal(matchedProduct, 1, true);
    // orderSummary.totalLeafCount += matchedProduct.leafCount;
    clearCartUI();
    renderCartPage(getCartFromLocal(), allProducts);
}

function setIncreaseEvent() {
    let incrementBtns = document.querySelectorAll(".cart-increase-count");
    for(let btn of incrementBtns) {
        btn.addEventListener("click", e => {
            let productId = Number(e.currentTarget.dataset.productId);
            increaseItemCount(productId);
        });
    }
}

// DECREMENT FUNCTIONS
function deleteItemFromCart(productId, cartItemsList) {
    let cartItems = cartItemsList ? cartItemsList : getCartFromLocal();
    cartItems = cartItems.filter(p => p.productId !== productId);
    setCartToLocal(cartItems);
}

function setDeleteEvent() {
    let deleteBtns = document.querySelectorAll('.trash-button');
    for(let btn of deleteBtns) {
        btn.addEventListener("click", e => {
            let productId = Number(e.currentTarget.dataset.productId);
            deleteItemFromCart(productId, getCartFromLocal());
            clearCartUI();
            renderCartPage(getCartFromLocal(), allProducts);
        });
    }
}

function removeItemFromCart(productId, quantity) {
    let cartItems = getCartFromLocal();
    let matchingCartItem = cartItems.find(p => p.productId === productId);
    matchingCartItem.quantity -= quantity;
    if(matchingCartItem.quantity <= 0 ) {
        deleteItemFromCart(productId, cartItems);
        return;
    }
    setCartToLocal(cartItems);
}

function decreaseItemCount(id) {
    removeItemFromCart(id, 1);
    let matchedProduct = getMatchingProduct(id);
    // orderSummary.subTotal = getSubTotal(matchedProduct, 1, false);
    // orderSummary.totalLeafCount -= matchedProduct.leafCount;
    clearCartUI();
    renderCartPage(getCartFromLocal(), allProducts);
}

function setDecrementEvent() {
    let decrementBtns = document.querySelectorAll(".cart-decrease-count");
    for(let btn of decrementBtns) {
        btn.addEventListener("click", e => {
            let id = Number(e.currentTarget.dataset.productId);
            decreaseItemCount(id, 1);
        });
    }
}

// CART SUMMARY HELPERS
function calculateOrderSummary(orderSummary) {
    orderSummary.shipping = orderSummary.subTotal > 50 ? 0 : Number((orderSummary.subTotal * (shippingPercent/100)).toFixed(2));
    orderSummary.tax = Number((orderSummary.subTotal * (taxPercent/100)).toFixed(2));
    orderSummary.total = Number((orderSummary.subTotal + orderSummary.shipping + orderSummary.tax).toFixed(2));
}

// UI FUNCTIONS  
function getTotalPrice(quantity, price) {
    return (quantity * price).toFixed(2);
}

function createCartUI() {
    return `
        <div class="cart-content-container" id="cartContainer">

        </div>
    `
}

function renderEmptyCartUI() {
    let emptyCartUI =  `
        <div class="empty-cart-container">
            <div class="empty-icons-container">
                <i data-lucide="circle-x" class="empty-cart-x-icon"></i>
                <i data-lucide="shopping-cart" class="empty-cart-icon"></i>
            </div>
            <h3 class="empty-cart-header">Your Cart is <span class="text-empty">Empty!</span></h3>
            <p class="empty-cart-description">Looks like you haven't added anything to your cart yet</p>
            <a href="./products.html">
                <button class="shop-now-btn">Shop Now</button>
            </a>
        </div>
    `
    document.getElementById("cartSection").insertAdjacentHTML("afterbegin", emptyCartUI);
}

function createCartItem(product, quantity) {
    let displayPrice = product.hasOffer ? product.discountPrice : product.actualPrice
    return `
        <div class="cart-list-item">
            <img class="cart-product-image" src="${product.imageUrl}" alt="${product.name}">
            <div class="cart-product-content">
                <div class="cart-product-text">
                    <h3 class="cart-product-title">${product.name}</h3>
                    <p class="cart-product-description">${product.description}</p>
                    <span class="cart-product-price">$${displayPrice}</span>
                </div>
                <div class="cart-product-actions">
                    <button class="trash-button" data-product-id="${product.id}">
                        <i class="trash-icon" data-lucide="trash-2"></i>
                    </button>
                    <div class="product-count-actions">
                        <button class="cart-count-control cart-decrease-count" data-product-id="${product.id}">
                            <i class="count-control-icon" data-lucide="minus"></i>
                        </button>
                        <span class="cart-product-count">${quantity}</span>
                        <button class="cart-count-control cart-increase-count" data-product-id="${product.id}">
                            <i class="count-control-icon" data-lucide="plus"></i>
                        </button>
                    </div>
                    <span class="cummulative-product-price">$${getTotalPrice(quantity, displayPrice)}</span>
                </div>
            </div>
        </div>
    `
}

function createOrderSummaryUI(orderSummary) {
    calculateOrderSummary(orderSummary);
    return `
        <div class="cart-summary-container">
            <h2 class="cart-summary-title">Order Summary</h2>
            <div class="order-pricing-section">
                <div class="order-pricing-category">
                    <span>Sub Total</span>
                    <span>$${orderSummary.subTotal}</span>
                </div>
                <div class="order-pricing-category">
                    <span>Shipping</span>
                    <span>$${orderSummary.shipping ? orderSummary.shipping : "FREE"}</span>
                </div>
                ${orderSummary.subTotal <= 50 ? `<p class="shipping-text">Free shipping on orders over $50</p>` : ''}
                <div class="order-pricing-category">
                    <span>Tax</span>
                    <span>$${orderSummary.tax}</span>
                </div>
            </div>
            <div class="order-pricing-category order-total">
                <span>Total</span>
                <span>$${orderSummary.total}</span>
            </div>
            <div class="cart-leaf-container">
                <i class="cart-leaf-icon" data-lucide="leaf"></i>
                <div>
                    <p class="cart-leaf-title">Earn ${orderSummary.totalLeafCount} Leaves</p>
                    <p class="cart-leaf-description">Add to your Reward Balance</p>
                </div>
            </div>
            <div class="cart-buttons">
                <a href="checkout.html" class="cart-btn-container">
                    <button class="checkout-button">Proceed to Checkout</button>
                </a>
                <a href="products.html" class="cart-btn-container">
                    <button class="continue-shopping-button">Continue Shopping</button>
                </a>
            </div>
        </div>
    `
}


