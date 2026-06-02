import { WaterNeedsLabel, LightNeedsLabel } from '../utils/constants.js'; 

lucide.createIcons();

// RENDERING PRODUCTS FOR TRENDING DEALS
function calculateDiscoutPercent(actualPrice, discountPrice) {
    return Math.floor(((actualPrice - discountPrice) / actualPrice) * 100);
}

// CREATE PRODUCT CARD
export function createProductCard(product) {
    if(product.hasOffer) {
        product.discountPercent = calculateDiscoutPercent(product.actualPrice, product.discountPrice);
    }
    return `
        <div class="product-card-container">
            <a href="product-details.html?id=${product.id}" class="product-details-link">
                <img class="product-card-image" src=${product.imageUrl} alt="${product.name}">
                ${
                    product.hasOffer ? `<span class="discount-percent-pill">-${product.discountPercent}%</span>` : ''
                }
            </a>
            <div class="product-card-content">
                <div>
                    <a href="product-details.html?id=${product.id}" class="product-details-link"><h5 class="product-card-title">${product.name}</h5></a>
                    <p class="product-card-description">${product.description}</p>
                </div>
                <div class="plant-needs">
                    <span class="plant-needs-text">${LightNeedsLabel[product.lightNeed]}</span>
                    <span class="plant-needs-text">${WaterNeedsLabel[product.waterNeed]}</span>
                </div>
                <div class="plant-pricing-contianer">
                    <div class="plant-pricing">
                        <span class="discount-price">$${product.hasOffer ? product.discountPrice : product.actualPrice}</span>
                        ${
                            product.hasOffer ? `<span class="actual-price">$${product.actualPrice}</span>` : ''
                        }
                    </div>
                    <div class="leaf-count-pill">
                        <i class="leaf-count-icon" data-lucide="leaf"></i>
                        <span class="leaf-count">+${product.leafCount}</span>
                    </div>
                </div>
                <button class="add-cart-btn default-cart-btn" data-product-id="${product.id}">
                    <i class="add-cart-icon" data-lucide="shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `
}

export function createMobileProductCard(product) {
    if(product.hasOffer) {
        product.discountPercent = calculateDiscoutPercent(product.actualPrice, product.discountPrice);
    }
    return `
        <a href="product-details.html?id=${product.id}" class="product-details-link m-product-link">
            <div class="m-product-card-container">
                <img class="m-product-card-image" src=${product.imageUrl} alt="${product.name}">
                <div class="m-product-card-content">
                    <div class="m-product-card-header">
                        <h5 class="m-product-card-title">${product.name}</h5>
                        ${
                            product.hasOffer 
                            ? `<span class="m-discount-percent-pill">-${product.discountPercent}%</span>` 
                            : `
                                <div class="m-leaf-count-pill">
                                    <i class="m-leaf-count-icon" data-lucide="leaf"></i>
                                    <span class="m-leaf-count">+${product.leafCount}</span>
                                </div>
                            ` 
                        }
                    </div>
                    <p class="m-product-card-description">${product.description}</p>
                    <div class="m-plant-pricing">
                        <span class="m-display-price">$${product.hasOffer ? product.discountPrice : product.actualPrice}</span>
                        ${
                            product.hasOffer ? `<span class="m-actual-price">$${product.actualPrice}</span>` : ''
                        }
                    </div>
                </div>
            </div>
        </a>
    `
}

