const viewer = document.getElementById('viewer');
const sidebar = document.querySelector('.sidebar');
const cardsContainer = document.querySelector('.cards');
const sortBtn = document.getElementById('sort-btn');
const searchInput = document.getElementById('searchInput');
const toggleBtn = document.getElementById('toggle-btn');

let sortAsc = true;

function getCards() {
    return Array.from(cardsContainer.querySelectorAll('.card'));
}

function loadPDF(card) {
    const link = card.dataset.link;
    viewer.src = link;

    localStorage.setItem('lastPDF', link);

    getCards().forEach(c => c.classList.remove('active'));
    card.classList.add('active');
}

searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();

    getCards().forEach(card => {
        const text = card.textContent;

        card.innerHTML = text;

        if (!q) {
            card.classList.remove('hidden');
            return;
        }

        const lowerText = text.toLowerCase();

        if (lowerText.includes(q)) {
            card.classList.remove('hidden');

            const regex = new RegExp(`(${q})`, 'gi');
            card.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
        } else {
            card.classList.add('hidden');
        }
    });
});

function sortCards() {
    const list = getCards();

    list.sort((a, b) => {
        return sortAsc
            ? a.innerText.localeCompare(b.innerText, 'ru')
            : b.innerText.localeCompare(a.innerText, 'ru');
    });

    list.forEach(el => cardsContainer.appendChild(el));
}

sortBtn.onclick = () => {
    sortAsc = !sortAsc;

    sortBtn.innerText = sortAsc
        ? "Сортировка: А→Я"
        : "Сортировка: Я→А";

    localStorage.setItem('sortAsc', sortAsc);
    sortCards();
};

toggleBtn.onclick = () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
};

document.addEventListener('DOMContentLoaded', () => {
    const last = localStorage.getItem('lastPDF');

    if (last) {
        viewer.src = last;

        getCards().forEach(c => {
            if (c.dataset.link === last) c.classList.add('active');
        });
    }

    sortAsc = localStorage.getItem('sortAsc') !== 'false';

    if (!sortAsc) {
        sortBtn.innerText = "Сортировка: Я→А";
    }

    sortCards();

    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
});

cardsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card || !cardsContainer.contains(card)) return;
    loadPDF(card);
});
