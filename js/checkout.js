import { renderNavbar, renderFooter } from './shared/layout.js';

// RENDER LAYOUT
renderNavbar();
renderFooter();

// INITIALIZE ICONS
lucide.createIcons();

fetch("../../data/states.json")
    .then(res => res.json())
    .then(data => {
        for(let s of data) {
            document.getElementById("stateSelect").insertAdjacentHTML("beforeend", createStateOption(s));
        }
});

let cartItems = JSON.parse(localStorage.getItem("cart"));
console.log(cartItems);
fetch("../../data/all-products.json")
    .then(res => res.json())
    .then(data => {
        let subTotal = 0;
        let total = 0;
        let tax = 0;
        let shipping = 0;
        for(let i of cartItems) {
            let matchedProduct = data.find(p => p.id === i.productId);
            let price = Number((i.quantity * (matchedProduct.hasOffer ? matchedProduct.discountPrice : matchedProduct.actualPrice)).toFixed(2));
            let itemDetails = {
                image: matchedProduct.imageUrl,
                name: matchedProduct.name,
                quantity: i.quantity,
                displayPrice: price
            }
            subTotal = Number((subTotal + price).toFixed(2));
            document.getElementById("summaryList").insertAdjacentHTML("beforeend", createCheckoutSummary(itemDetails));
        }
        shipping = subTotal > 50 ? 0 : Number((subTotal * 0.1).toFixed(2));
        tax = Number((subTotal * 0.1).toFixed(2));
        total = Number((subTotal + shipping + tax).toFixed(2));
        document.getElementById("subTotalPrice").textContent = `$${subTotal}`;
        document.getElementById("shippingPrice").textContent = `$${subTotal > 50 ? "Free" : shipping}`;
        document.getElementById("taxPrice").textContent = `$${tax}`;
        document.getElementById("totalPrice").textContent = `$${total}`;
})

function createStateOption(state) {
    return `
        <option value="${state.value}">${state.name}</option>
    `
}

function createCheckoutSummary(itemDetails) {
    return `
        <div class="summary-item-container">
            <img class="item-image" src="${itemDetails.image}" alt="">
            <div class="item-details">
                <p class="item-name">${itemDetails.name}</p>
                <p class="item-quantity">Qty: ${itemDetails.quantity}</p>
                <p class="item-price">$${itemDetails.displayPrice}</p>
            </div>
        </div>
    `
}
