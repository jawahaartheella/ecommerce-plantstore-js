import { updateCartBadgeCount } from "../shared/cart-service.js"

// INITIALIZE ICONS
lucide.createIcons();

// FETCH NAVBAR
export function renderNavbar() {
    fetch('../../html/components/navbar.html')
        .then(res => res.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);

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