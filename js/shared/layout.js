import { updateCartBadgeCount } from "../shared/cart-service.js"

// INITIALIZE ICONS
lucide.createIcons();

// FETCH NAVBAR
export function renderNavbar() {
    fetch('../../html/components/navbar.html')
        .then(res => res.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);

            let homPrefix = window.location.pathname.includes('/html/pages') ? "../../" : "";
            let pagePrefix = window.location.pathname.includes('/html/pages') ? "../pages/" : "./html/pages/";

            let desktopNavItems = `
                <li><a class="nav-link" href="${homPrefix}index.html">Home</a></li>
                <li><a class="nav-link" href="${pagePrefix}products.html">Plants</a></li>
                <li><a class="nav-link" href="${pagePrefix}about.html">About</a></li>
                <li><a class="nav-link" href="${pagePrefix}care-tips.html">Care Tips</a></li>
            `
            let mobileNavItems = `
                <li class="nav-menu-item"><a class="nav-menu-link" href="${homPrefix}index.html">Home</a></li>
                <li class="nav-menu-item"><a class="nav-menu-link" href="${pagePrefix}products.html">Plants</a></li>
                <li class="nav-menu-item"><a class="nav-menu-link" href="${pagePrefix}about.html">About</a></li>
                <li class="nav-menu-item"><a class="nav-menu-link" href="${pagePrefix}care-tips.html">Care Tips</a></li>
            `

            document.getElementById("desktopNavList").insertAdjacentHTML("beforeend", desktopNavItems);
            document.getElementById("mobileNavList").insertAdjacentHTML("beforeend", mobileNavItems);

            let cartIcons = document.querySelectorAll(".nav-cart");
            cartIcons.forEach(i => {
                i.setAttribute("href", `${pagePrefix}cart.html`);
            });

            document.getElementById('searchInput').addEventListener("keydown", e => {
                if(e.key === "Enter") {
                    window.location.href = `products.html?search=${e.target.value}`;
                }
            });

            document.getElementById('toggleMenu').addEventListener('click', e => {
                document.getElementById("navMenu").classList.toggle('open');
                document.getElementById("showMenuIcon").classList.toggle('hide');
                document.getElementById("hideMenuIcon").classList.toggle('show');
            });

            updateCartBadgeCount();
            lucide.createIcons();
    });
}

// FETCH FOOTER
export function renderFooter(config) {
    fetch('../../html/components/footer.html')
        .then(res => res.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            if(config && config?.includeCTA) {
                renderCTASection();
            }
            document.getElementById('copyrightYear').textContent = new Date().getFullYear();
            lucide.createIcons();
    });
}

// FETCH CTA SECTION
export function renderCTASection() {
    fetch('../../html/components/cta-section.html')
        .then(res => res.text())
        .then(data => {
            document.querySelector("footer").insertAdjacentHTML("beforebegin", data);
            lucide.createIcons();
        })
}