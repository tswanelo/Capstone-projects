// Import files
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Initialize variables
let matches = books; // Array of books to display
let page = 1;        // Current page number
const range = [0, 10];    // Range of books to display


// Data validation checks
if (!books || !Array.isArray(books)) {
  throw new Error('Source required');
}

if (!range || range.length < 2) {
  throw new Error('Range must be an array with two numbers');
}

// Themes configuration
const Themes = {
  day: {
    dark: '10, 10, 20',   // Dark mode color values for the 'day' theme
    light: '255, 255, 255', // Light mode color values for the 'day' theme
  },
  night: {
    dark: '255, 255, 255',  // Dark mode color values for the 'night' theme
    light: '10, 10, 20',    // Light mode color values for the 'night' theme
  },
};


// Theme selection logic
const Select = document.querySelector('[data-settings-theme]');
const css = document.getElementById('settings');
css.addEventListener('submit', (event) => {
  event.preventDefault();
  const theme = Select.value;

  // Set CSS variables to change theme colors
  document.documentElement.style.setProperty('--color-dark', Themes[theme].dark);
  document.documentElement.style.setProperty('--color-light', Themes[theme].light);
});


// Initial theme setup based on user preference (dark or light mode)
const DarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = DarkMode ? 'night' : 'day';
document.documentElement.style.setProperty('--color-dark', Themes[initial].dark);
document.documentElement.style.setProperty('--color-light', Themes[initial].light);




// Generate book list
const bookList = document.querySelector('[data-list-items]');
const fragment = document.createDocumentFragment();

// Loop through books and create preview elements
const extracted = books.slice(0, 36);
for (let i = 0; i < extracted.length; i++) {
  const bookPreviews = document.createElement('dl');
  bookPreviews.className = 'preview';
  // Set dataset attributes for each book
  bookPreviews.dataset.id = extracted[i].id;
  bookPreviews.dataset.title = extracted[i].title;
  bookPreviews.dataset.image = extracted[i].image;
  bookPreviews.dataset.subtitle = `${authors[extracted[i].author]} (${new Date(extracted[i].published).getFullYear()})`;
  bookPreviews.dataset.description = extracted[i].description;
  bookPreviews.dataset.genre = extracted[i].genres;

  // Set inner HTML for each preview element
  bookPreviews.innerHTML = /*html*/ `
    <div>
      <img class='preview__image' src="${extracted[i].image}" alt="no picture available" />
    </div>
    <div class='preview__info'>
      <dt class='preview__title'>${extracted[i].title}</dt>
      <dt class='preview__author'> By ${authors[extracted[i].author]}</dt>
    </div>`;

  fragment.appendChild(bookPreviews);
}

bookList.appendChild(fragment);



// Handle search button clicks
document.querySelector('[data-header-search]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').showModal();
  document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').close();
});


// Handle settings button clicks
document.querySelector('[data-header-settings]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').showModal();
  document.querySelector('[data-settings-theme]').focus();
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').close();
});



// Handle book view selection
const detailsToggle = (event) => {
  
  if (event.target.dataset.id) {
    document.querySelector('[data-list-active]').style.display = "block";
  }

  if (event.target.dataset.title) {
    document.querySelector('[data-list-title]').textContent = event.target.dataset.title;
  }

  if (event.target.dataset.subtitle) {
    document.querySelector('[data-list-subtitle]').textContent = event.target.dataset.subtitle;
  }

  if (event.target.dataset.description) {
    document.querySelector('[data-list-description]').textContent = event.target.dataset.description;
  }

  if (event.target.dataset.image) {
    document.querySelector('[data-list-image]').setAttribute('src', event.target.dataset.image);
    document.querySelector('[data-list-blur]').setAttribute('src', event.target.dataset.image);
  }
};


document.querySelector('[data-list-close]').addEventListener('click', () => {
  document.querySelector('[data-list-active]').style.display = "";
});

bookList.addEventListener('click', detailsToggle);



// Create options for genres select dropdown
const genresFragment = document.createDocumentFragment();
let element = document.createElement('option');
element.value = 'any';
element.textContent = 'All Genres';
genresFragment.appendChild(element);

for (const [id, name] of Object.entries(genres)) {
  element = document.createElement('option');
  element.value = id;
  element.textContent = name;
  genresFragment.appendChild(element);
}

document.querySelector('[data-search-genres]').appendChild(genresFragment);


// Create options for authors select dropdown
const authorsFragment = document.createDocumentFragment();
element = document.createElement('option');
element.value = 'any';
element.textContent = 'All Authors';
authorsFragment.appendChild(element);

for (const [id, name] of Object.entries(authors)) {
  element = document.createElement('option');
  element.value = id;
  element.textContent = name;
  authorsFragment.appendChild(element);
}

document.querySelector('[data-search-authors]').appendChild(authorsFragment);
document.querySelector('[data-search-authors]').appendChild(genresFragment);
document.querySelector('[data-list-button]').innerHTML = `
  <span>Show more</span>
  <span class="list__remaining">(${Math.max(0, matches.length - page * BOOKS_PER_PAGE)})</span>
`;









