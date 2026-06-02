import { renderNavbar, renderFooter } from './shared/layout.js';

// RENDER LAYOUT
renderNavbar();
renderFooter({includeCTA: true});

lucide.createIcons();

fetch("../../data/team.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(p => {
            document.getElementById("teamList").insertAdjacentHTML("beforeend", createTeamCard(p))
        });
});

function createTeamCard(member) {
    return `
        <div class="team-member-container">
            <img class="team-member-image" src="${member.image}" alt="team-image">
            <h4 class="team-member-name">${member.name}</h4>
            <p class="team-member-tagline">${member.tagline}</p>
            <p class="team-member-designation">${member.role}</p>
        </div>
    `
}