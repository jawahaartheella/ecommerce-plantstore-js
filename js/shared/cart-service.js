export function initializeAddToCartButtons(selector, getQuantity) {
    let cartbtns = document.querySelectorAll(selector);
    for(let btn of cartbtns) {
        btn.addEventListener("click", e => {
            const quantity = getQuantity();
            let productId = Number(e.currentTarget.dataset.productId);
            addItemToCart(productId, quantity);
            console.log(localStorage.getItem('cart'));
        });
    }
}

export function addItemToCart(productId, quantity = 1) {
    let cartList = JSON.parse(localStorage.getItem('cart'));
    if(cartList && cartList?.length) {
        let matchedCartItem = cartList.find(p => p.productId === productId);
        if(matchedCartItem) {
            matchedCartItem.quantity += quantity;
        } else {
            cartList.push({productId: productId, quantity: quantity});
        }
        localStorage.setItem('cart', JSON.stringify(cartList));
    } else {
        cartList = [{productId: productId, quantity: quantity}];
        localStorage.setItem('cart', JSON.stringify(cartList));
    }
    updateCartBadgeCount();
}

export function removeCartItem(productId, quantity = 1) {
    let cartList = JSON.parse(localStorage.getItem('cart'));
    if(cartList && cartList.length) {
        let matchedCartItem = cartList.find(p => p.productId === productId);
        if(matchedCartItem) {
            matchedCartItem.quantity -= quantity;
        }
        localStorage.setItem('cart', JSON.stringify(cartList));
        updateCartBadgeCount();
    }
}

function renderCartBadge(count) {
    return `
        <span class="cart-badge" id="cartBadgeCount">${count}</span>
    `
}

export function updateCartBadgeCount() {
    let cartList = JSON.parse(localStorage.getItem('cart'));
    if(cartList && cartList.length) {
        let cartCount = cartList.reduce((acc, item) => {
            return acc + item.quantity
        }, 0);
        let navCartElements = document.querySelectorAll('.nav-cart');
        navCartElements.forEach(el => {
            let badge = el.querySelector('#cartBadgeCount');
            if(badge) {
                badge.textContent = cartCount;
            } else {
                el.insertAdjacentHTML("beforeend", renderCartBadge(cartCount));
            }
        });
    } else {
        let badgeElement = document.getElementById("cartBadgeCount");
        if(badgeElement) {
            badgeElement.remove();
        }
    }
}