const comics = [
    { id: 1, title: "별의 아이", genre: "SF, 모험", description: "아무도 가본 적 없는 우주를 탐험하는 소년의 이야기입니다.", cover: "https://placehold.co/400x550/e8d5b1/5e4d41?text=별의+아이", pages: ["https://placehold.co/800x1200/f8e5c8/5e4d41?text=별의+아이+1", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=별의+아이+2", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=별의+아이+3", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=별의+아이+4", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=별의+아이+5"] },
    { id: 2, title: "도시의 그림자", genre: "느와르, 스릴러", description: "어두운 도시 속에서 진실을 쫓는 형사의 이야기입니다.", cover: "https://placehold.co/400x550/c7b29a/4a4a4a?text=도시의+그림자", pages: ["https://placehold.co/800x1200/e7d7c6/4a4a4a?text=도시의+그림자+1", "https://placehold.co/800x1200/e7d7c6/4a4a4a?text=도시의+그림자+2", "https://placehold.co/800x1200/e7d7c6/4a4a4a?text=도시의+그림자+3"] },
    { id: 3, title: "마법의 숲", genre: "판타지, 로맨스", description: "마법으로 가득한 신비로운 숲에서 펼쳐지는 모험과 사랑 이야기.", cover: "https://placehold.co/400x550/f5d5e5/7e5f8a?text=마법의+숲", pages: ["https://placehold.co/800x1200/f8e5c8/a18a7a?text=마법의+숲+1", "https://placehold.co/800x1200/f8e5c8/a18a7a?text=마법의+숲+2", "https://placehold.co/800x1200/f8e5c8/a18a7a?text=마법의+숲+3"] },
    { id: 4, title: "시간여행자의 일기", genre: "SF, 드라마", description: "과거와 미래를 오가며 역사를 바꾸는 시간여행자의 이야기.", cover: "https://placehold.co/400x550/a8c3d9/425a6f?text=시간여행자의+일기", pages: ["https://placehold.co/800x1200/f8e5c8/425a6f?text=시간여행자의+일기+1", "https://placehold.co/800x1200/f8e5c8/425a6f?text=시간여행자의+일기+2", "https://placehold.co/800x1200/f8e5c8/425a6f?text=시간여행자의+일기+3"] },
    { id: 5, title: "은하철도 999", genre: "SF, 모험", description: "태고적부터 이어진 전설적인 만화, 은하철도 999의 모험 이야기.", cover: "https://placehold.co/400x550/5e4d41/e8d5b1?text=은하철도+999", pages: ["https://placehold.co/800x1200/f8e5c8/5e4d41?text=은하철도+999+1", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=은하철도+999+2", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=은하철도+999+3"] },
    { id: 6, title: "드래곤볼", genre: "액션, 모험", description: "소년 손오공의 모험과 성장, 그리고 드래곤볼을 찾는 이야기.", cover: "https://placehold.co/400x550/d2c18d/4a4a4a?text=드래곤볼", pages: ["https://placehold.co/800x1200/f8e5c8/5e4d41?text=드래곤볼+1", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=드래곤볼+2", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=드래곤볼+3"] },
    { id: 7, title: "슬램덩크", genre: "스포츠, 학원", description: "농구를 통해 성장하는 소년들의 이야기를 그린 전설적인 스포츠 만화.", cover: "https://placehold.co/400x550/a18a7a/f8e5c8?text=슬램덩크", pages: ["https://placehold.co/800x1200/f8e5c8/5e4d41?text=슬램덩크+1", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=슬램덩크+2", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=슬램덩크+3"] },
    { id: 8, title: "원피스", genre: "모험, 판타지", description: "해적왕을 꿈꾸는 루피와 그의 동료들의 대해적 시대 모험 이야기.", cover: "https://placehold.co/400x550/e4a15f/ffffff?text=원피스", pages: ["https://placehold.co/800x1200/f8e5c8/5e4d41?text=원피스+1", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=원피스+2", "https://placehold.co/800x1200/f8e5c8/5e4d41?text=원피스+3"] },
];

let currentPage = 0;
let currentComicPages = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let guestbook = JSON.parse(localStorage.getItem('guestbook')) || [];

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');
const noResultsMessage = document.getElementById('no-results-message');
const favoritesList = document.getElementById('favorites-list');
const historyList = document.getElementById('history-list');
const guestbookForm = document.getElementById('guestbook-form');
const guestbookEntries = document.getElementById('guestbook-entries');
const noGuestbookMessage = document.getElementById('no-guestbook-message');
const comicModal = document.getElementById('comic-modal');
const modalContent = document.getElementById('modal-content');
const closeModalButton = document.getElementById('close-modal');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

// Function to render comic cards
function renderComics(comicArray, container, showFavorites = false) {
    container.innerHTML = '';
    if (comicArray.length === 0) {
        container.nextElementSibling.classList.remove('hidden');
        return;
    } else {
        container.nextElementSibling.classList.add('hidden');
    }
    comicArray.forEach(comic => {
        const isFavorite = favorites.includes(comic.id);
        const favoriteIcon = isFavorite ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star text-gray-400';
        const card = document.createElement('div');
        card.className = 'comic-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer';
        card.innerHTML = `
            <div class="relative">
                <img src="${comic.cover}" alt="${comic.title} 표지" class="comic-card-image">
                <button class="favorite-btn absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition-colors" data-id="${comic.id}">
                    <i class="${favoriteIcon}"></i>
                </button>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-bold truncate">${comic.title}</h3>
                <p class="text-sm text-gray-500 mb-2">${comic.genre}</p>
                <p class="text-xs text-gray-600 line-clamp-3">${comic.description}</p>
            </div>
        `;
        card.querySelector('.comic-card-image').addEventListener('click', () => openComicModal(comic));
        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(comic.id, e.currentTarget);
        });
        container.appendChild(card);
    });
}

// Home Page - Render Recommended Comics
function renderRecommended() {
    const shuffled = [...comics].sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 3);
    renderComics(recommended, document.getElementById('recommended-comics'));
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredComics = comics.filter(comic => comic.title.toLowerCase().includes(searchTerm));
    renderComics(filteredComics, searchResultsContainer);
});

// Toggle Favorite
function toggleFavorite(id, button) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        button.querySelector('i').className = 'fa-regular fa-star text-gray-400';
    } else {
        favorites.push(id);
        button.querySelector('i').className = 'fa-solid fa-star text-yellow-400';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Render Favorites
function renderFavorites() {
    const favoriteComics = comics.filter(comic => favorites.includes(comic.id));
    renderComics(favoriteComics, favoritesList);
}

// Add to History
function addToHistory(id) {
    if (!history.includes(id)) {
        history.push(id);
        localStorage.setItem('history', JSON.stringify(history));
    }
}

// Render History
function renderHistory() {
    const historyComics = comics.filter(comic => history.includes(comic.id));
    renderComics(historyComics, historyList);
}

// Guestbook Functionality
function renderGuestbook() {
    if (guestbook.length === 0) {
        noGuestbookMessage.classList.remove('hidden');
    } else {
        noGuestbookMessage.classList.add('hidden');
    }
    guestbookEntries.innerHTML = '';
    guestbook.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'p-4 bg-gray-100 rounded-lg shadow-sm';
        entryDiv.innerHTML = `<p class="text-sm text-gray-800">${entry}</p>`;
        guestbookEntries.appendChild(entryDiv);
    });
}

guestbookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('guestbook-message');
    const message = messageInput.value.trim();
    if (message) {
        guestbook.unshift(message);
        localStorage.setItem('guestbook', JSON.stringify(guestbook));
        messageInput.value = '';
        renderGuestbook();
    }
});

// Modal Logic
function openComicModal(comic) {
    addToHistory(comic.id);
    currentComicPages = comic.pages;
    currentPage = 0;
    renderPage();
    comicModal.classList.remove('hidden');
}

closeModalButton.addEventListener('click', () => {
    comicModal.classList.add('hidden');
});

function renderPage() {
    modalContent.innerHTML = '';
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-container p-2 md:p-4 flex flex-1 justify-center items-center';
    
    const pageImage = document.createElement('img');
    pageImage.className = 'page-image rounded-lg shadow-md';
    pageImage.src = currentComicPages[currentPage];

    const pageNumber = document.createElement('div');
    pageNumber.className = 'absolute bottom-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs font-semibold';
    pageNumber.innerText = `${currentPage + 1} / ${currentComicPages.length}`;
    
    pageDiv.appendChild(pageImage);
    pageDiv.appendChild(pageNumber);
    modalContent.appendChild(pageDiv);
    
    prevPageButton.disabled = currentPage === 0;
    nextPageButton.disabled = currentPage >= currentComicPages.length - 1;
}

prevPageButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < currentComicPages.length - 1) {
        currentPage++;
        renderPage();
    }
});

// Navigation and Initial Rendering
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = e.target.dataset.section;
        sections.forEach(sec => sec.classList.add('hidden'));
        document.getElementById(`${sectionId}-section`).classList.remove('hidden');

        if (sectionId === 'search') {
            renderComics(comics, searchResultsContainer);
        } else if (sectionId === 'favorites') {
            renderFavorites();
        } else if (sectionId === 'history') {
            renderHistory();
        } else if (sectionId === 'guestbook') {
            renderGuestbook();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderRecommended();
});