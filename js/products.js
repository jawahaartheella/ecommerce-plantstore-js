import { PlantNeedPriority, SortOptions } from './utils/constants.js';  
import { createMobileProductCard, createProductCard } from './shared/product-card.js';
import { renderNavbar, renderFooter } from './shared/layout.js';
import { initializeAddToCartButtons } from './shared/cart-service.js';

// INITIALIZE ICONS
lucide.createIcons();
let productsDataUrl = "../../data/all-products.json"

// RENDER LAYOUT
renderNavbar();
renderFooter();

// FILTERING VARIABLES
let activeFilters = {
    categories: [],
    waterNeeds: [],
    lightNeeds: [],
    offerOnly: false,
    priceValue: 100,
    searchText: '',
    sortBy: SortOptions.MOST_POPULAR
};
let allProducts = [];
let paginatedProducts = [];

function getPriorityValue(priorityString) {
    return PlantNeedPriority[priorityString.toUpperCase()];
}

// RENDER PRODUCT LIST LOGIC
function renderProductsList(productList) {
    document.getElementById('productsListContainer').innerHTML = '';
    paginatedProducts = productList;
    let createCard = (window.innerWidth < 768) 
                        ? createMobileProductCard
                        : createProductCard
    setPaginationText(paginatedProducts.length, productList.length);
    for(let p of productList) {
        document.getElementById('productsListContainer').insertAdjacentHTML("beforeend", createCard(p));
    }
}

// SET PAGINATION TEXT
function setPaginationText(currentProductsCount, totalProductsCount) {
    document.getElementById('paginatedProducts').textContent = currentProductsCount;
    document.getElementById('allFilteredProducts').textContent = totalProductsCount;
}

// ATTACH LISTENERS TO ELEMENTS:
document.querySelectorAll('.filter-input').forEach(filterItem => {
    filterItem.addEventListener("change", (e) => {
        if(e.target.classList.contains('category-filter')) {
            if(e.target.checked) {
                activeFilters.categories.push(e.target.value);
            } else {
                activeFilters.categories = activeFilters.categories.filter(f => f !== e.target.value);
            }
        } else if(e.target.classList.contains('sunlight-filter')) {
            if(e.target.checked) {
                activeFilters.lightNeeds.push(getPriorityValue(e.target.value));
            } else {
                activeFilters.lightNeeds = activeFilters.lightNeeds.filter(f => f !== getPriorityValue(e.target.value));
            }
        } else if(e.target.classList.contains('water-filter')) {
            if(e.target.checked) {
                activeFilters.waterNeeds.push(getPriorityValue(e.target.value));
            } else {
                activeFilters.waterNeeds = activeFilters.waterNeeds.filter(f => f !== getPriorityValue(e.target.value));
            }
        } else if(e.target.classList.contains('offer-filter-input')) {
            activeFilters.offerOnly = e.target.checked;
        }

        applyFilters();
    });
});

// PRICE RANGE FILTER LISTENER
document.getElementById('priceRange').addEventListener("input", (e) => {
    activeFilters.priceValue = e.target.value;
    document.getElementById('maxPrice').textContent = e.target.value;
    applyFilters();
});

// SORT SELECT LISTENER
document.getElementById('sort').addEventListener('change', e => {
    activeFilters.sortBy = e.target.value;
    applyFilters();
});

// FILTERING LOGIC
function filterProductList(productList) {
    const filteredList = productList.filter(plant => {
        let matchedProduct = (activeFilters.categories.length === 0 || activeFilters.categories.includes(plant.category)) && 
                            (activeFilters.waterNeeds.length === 0 || activeFilters.waterNeeds.includes(plant.waterNeed)) &&
                            (activeFilters.lightNeeds.length === 0 || activeFilters.lightNeeds.includes(plant.lightNeed)) &&
                            (plant.hasOffer ? plant.discountPrice < activeFilters.priceValue : plant.actualPrice < activeFilters.priceValue) &&
                            (activeFilters.offerOnly ? plant.hasOffer : true) && 
                            (!activeFilters.searchText || plant.name.toLowerCase().includes(activeFilters.searchText.toLowerCase()))
        return matchedProduct;
    });

    return filteredList;
}

// SORTING LOGIC
function sortProductList(productList) {
    let filteredProdsCopy = [...productList];

    // SORTING LOGIC
    if(activeFilters.sortBy) {
        switch(activeFilters.sortBy) {
            case SortOptions.MOST_POPULAR:
                filteredProdsCopy.sort((a,b) => {
                    return (b.purchaseCount - a.purchaseCount);   
                });
                break;
            case SortOptions.NEWEST_FIRST:
                filteredProdsCopy.sort((a,b) => {
                    let a_date = new Date(a.addedDate);
                    let b_date = new Date(b.addedDate);

                    return (b_date - a_date);
                });
                break;
            case SortOptions.PRICE_LOW_TO_HIGH:
                filteredProdsCopy.sort((a,b) => {
                    let a_price = a.hasOffer ? a.discountPrice : a.actualPrice;
                    let b_price = b.hasOffer ? b.discountPrice : b.actualPrice;
                    
                    return (a_price - b_price);
                });
                break;
            case SortOptions.PRICE_HIGH_TO_LOW:
                filteredProdsCopy.sort((a,b) => {
                    let a_price = a.hasOffer ? a.discountPrice : a.actualPrice;
                    let b_price = b.hasOffer ? b.discountPrice : b.actualPrice;
                    
                    return (b_price - a_price);
                });
                break;
            default: console.log("An Error Occured!");
        }
        return filteredProdsCopy;
    }
    
    return productList
}

// APPLY FILTER LOGIC
function applyFilters() {
    let filteredProducts = filterProductList(allProducts);
    let sortedProducts = sortProductList(filteredProducts);
    renderProductsList(sortedProducts);
}

// RENDERING PRODUCTS ON PAGE LOAD
fetch(productsDataUrl)
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        let queryParams = new URLSearchParams(window.location.search);
        let searchText = queryParams.get('search');
        activeFilters.searchText = searchText;
        let category = queryParams.get('category');
        if(category) {
            activeFilters.categories.push(category);
            document.getElementById(category.toLowerCase()).checked = true;
        }
        applyFilters();
        initializeAddToCartButtons(".default-cart-btn", () => 1);
lucide.createIcons();
});

// CREATE SEARCH LIST
function createSearchList(searchText) {
    return `
        <div class="search-list-container">
            <ul class="search-list">
                <li class="search-item"><a href="">${searchText}</a></li>
            </ul>
        </div>
    `
}

// MOBILE RELATED FUNCTIONALITY
document.getElementById("filterDropdown").addEventListener("click", e => {
    document.getElementById("filterForm").classList.toggle('show');
    document.getElementById("dropdownIcon").classList.toggle('hide');
    document.getElementById("dropupIcon").classList.toggle('show');
});
