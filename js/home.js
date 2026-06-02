import { renderCTASection, renderFooter, renderNavbar } from "./shared/layout.js";
import { createProductCard } from "./shared/product-card.js";
import { initializeAddToCartButtons } from "./shared/cart-service.js";

// INITIALIZE ICONS
lucide.createIcons();
let productsDataUrl = "../../data/all-products.json"

// RENDER LAYOUT
renderNavbar();
renderFooter({includeCTA: true});
            
// TRENDING DEALS TIMER.
let offerEndingDate = new Date('2026-05-07T11:59:00');
// To set a specific date always use the below format
//         ****** YYYY-MM-DDTHH:MM:SS ****
let currentDate = new Date();

function calculateRemainingTime() {
    let timeLeft = offerEndingDate - currentDate;
    let daysLeft = Math.floor(timeLeft/(1000 * 60 * 60 * 24));
    let hoursLeft = Math.floor((timeLeft / (1000* 60 * 60)) % 24);
    let minutesLeft = Math.floor(timeLeft / (1000 * 60) % 60);
    let secondsLeft = Math.floor((timeLeft / (1000)) % 60);

    document.getElementById('daysCount').textContent = daysLeft;
    document.getElementById('hoursCount').textContent = hoursLeft;
    document.getElementById('minutesCount').textContent = minutesLeft;
    document.getElementById('secondsCount').textContent = secondsLeft;
}

setInterval(() => {
    if((offerEndingDate - currentDate) <= 0) {
        clearInterval();
        return;
    }
    calculateRemainingTime();
}, 1000);

fetch('../../data/all-products.json')
    .then(res => res.json())
    .then(data => {
        let offerProducts = data.filter(p => p.hasOffer);
        for(let plant of offerProducts) {
            document.getElementById('dealsList').insertAdjacentHTML("beforeend", createProductCard(plant));
        }
});

// RENDERING PLANT CATEGORIES
function createCategory(category) {
    return `
        <a href="products.html?category=${category.categoryName}">

            <div class="category-container">
                <div class="category-label">${category.label}</div>
                <span class="category-name">${category.name}</span>
            </div>
        </a>
    `
}

fetch('../../data/categories.json')
    .then(res => res.json())
    .then(categories => {
        for(let c of categories) {
            document.getElementById('categoryList').insertAdjacentHTML("beforeend", createCategory(c));
        }
});

// RENDERING NEW ARRIAVLS
fetch('../../data/all-products.json')
    .then(res => res.json())
    .then(data => {
        let sortedProducts = data.sort((a,b) => {
            let a_date = new Date(a.addedDate); 
            let b_date = new Date(b.addedDate);
            return (b_date - a_date);
        });
        sortedProducts = sortedProducts.slice(0,6);
        for(let p of sortedProducts) {
            document.getElementById('newArrivalsList').insertAdjacentHTML("beforeend", createProductCard(p));
        }
        initializeAddToCartButtons(".default-cart-btn", () => 1);
        lucide.createIcons();
});
