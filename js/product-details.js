import { renderNavbar, renderFooter } from "./shared/layout.js";
import { LightNeedsLabel, WaterNeedsLabel } from "./utils/constants.js";
import { createProductCard } from "./shared/product-card.js";
import { initializeAddToCartButtons } from "./shared/cart-service.js";

// INITIALIZE ICONS
lucide.createIcons();

// RENDER LAYOUT
renderNavbar();
renderFooter();

let quantityCount = 1;
let queryParams = new URLSearchParams(window.location.search);
let productId = queryParams.get('id');

function setIncreaseEvent() {
    document.getElementById('increaseCount').addEventListener("click", e => {
        document.getElementById('productQuantity').textContent = ++quantityCount;
    });
}

function setDecreaseEvent() {
    document.getElementById('decreaseCount').addEventListener("click", e => {
        if(quantityCount > 1) {
            document.getElementById('productQuantity').textContent = --quantityCount;
        }
    })
}

// RENDER PRODUCT DETAILS UI
fetch("../../data/all-products.json")
    .then(res => res.json())
    .then(data => {
        let product = data.find(p => p.id == productId);
        document.getElementById('detailsSection').insertAdjacentHTML("afterbegin", createDetailsStructure(product));
        renderRelatedProducts(data, product);
        setIncreaseEvent();
        setDecreaseEvent();
        let quantityEl = document.getElementById("productQuantity");
        initializeAddToCartButtons(".details-cart-btn", () => {
            return Number(quantityEl.textContent);
        });
        lucide.createIcons();
});

// RELATED PRODUCTS LOGIC
function renderRelatedProducts(productList, currentProduct) {
    let relatedProducts = productList.filter(p => ((p.category === currentProduct.category) && (p.id !== currentProduct.id)));
    if(relatedProducts.length > 4) {
        relatedProducts = relatedProducts.slice(0,4);
    }
    for(let p of relatedProducts) {
        document.getElementById('relatedProducts').insertAdjacentHTML("afterbegin", createProductCard(p));
    }
    initializeAddToCartButtons(".default-cart-btn", () => 1);
}

// CREATE PRODUCT DETAILS UI
function createDetailsStructure(product) {
    return `
        <div class="product-image-container">
            <img class="product-image" src="${product.imageUrl}" alt="monestra-delicosia">
        </div>
        <div class="product-details-container">
            <div class="product-header-container">
                <h1 class="product-header">${product.name}</h1>
                <div class="product-pricing-container">
                    <span class="display-price">$${product.hasOffer ? product.discountPrice : product.actualPrice}</span>
                    ${product.hasOffer ? `<span class="original-price">$${product.actualPrice}</span>` : ''}
                </div>
                <p class="product-description">${product.description}</p>
            </div>   
            <div class="requirements-list-container">
                <h3 class="care-requirements-header">Care Requirements</h3>
                <div class="requirements-list">
                    <div class="care-requirement">
                        <span class="requirement-type">Sunlight</span>
                        <span class="requirement-intensity">${LightNeedsLabel[product.lightNeed]}</span>
                    </div>
                    <div class="care-requirement">
                        <span class="requirement-type">Watering</span>
                        <span class="requirement-intensity">${WaterNeedsLabel[product.waterNeed]}</span>
                    </div>
                </div>
            </div>
            <div class="cart-quantity-container">
                <h3 class="quantity-header">Quantity</h3>
                <div class="quantity-count-container">
                    <button class="count-controls" id="decreaseCount">
                        <i class="count-control-icon" data-lucide="minus"></i>
                    </button>
                    <span class="quantity" id="productQuantity">${quantityCount}</span>
                    <button class="count-controls" id="increaseCount">
                        <i class="count-control-icon" data-lucide="plus"></i>
                    </button>
                </div>
                <button class="add-cart-button details-cart-btn" data-product-id=${productId}>
                    <i class="cart-btn-icon" data-lucide="shopping-cart"></i>
                    <span class="cart-btn-text">Add to Cart</span>
                </button>
            </div>
            <div class="leaf-reward-container">
                <i class="leaf-reward-icon" data-lucide="leaf"></i>
                <div class="leaf-reward-content">
                    <h4 class="leaf-reward-header">Earn ${product.leafCount} Leaves</h4>
                    <p class="leaf-reward-description">Add to your rewards balance with this purchase</p>
                </div>
            </div>
        </div>
    `
}


// Notes:
// -----

// Passing function into another function: "Higher-Order Functions"
// Definition
// ----------------------
// A function that: accepts another function OR returns another function is called: Higher-Order Function.apply

// Example
// initializeAddToCartButtons(
//    selector,
//    getQuantity
// )

// Here:
// getQuantity
// is function passed as argument.

// Also:
// Callback Function
// The passed function itself is called: callback function

// Example:
// () => Number(quantityElement.textContent)
// is callback.

// ALSO:
// Closure concept involved

// Because:
// () => quantityElement.textContent
// still remembers: quantityElement from outer scope.
// That’s: closure behavior

// So you are simultaneously using:
// ✅ Higher-order function
// (function accepting function)

// ✅ Callback function
// (function passed as argument)

// ✅ Closure
// (inner function remembers outer variables)