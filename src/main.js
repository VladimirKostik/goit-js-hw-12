// main.js
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery, perPage } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
// опційно: імпорт твого спінера, якщо використовуєш бібліотеку
// import 'loaders.css/loaders.min.css';

const form = document.querySelector('form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

let query = '';
let currentPage = 1;
let totalPages = 0;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  query = (formData.get('searchText') || '').trim();

  if (!query) {
    iziToast.error({
      position: 'topRight',
      title: 'Error',
      message: 'Ви нічого не ввели!',
    });
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(query, currentPage);

    if (!hits.length) {
      iziToast.error({
        position: 'topRight',
        title: 'Немає результатів',
        message: 'Нічого не знайдено',
      });
      return;
    }

    createGallery(hits, false);

    totalPages = Math.ceil(totalHits / perPage);

    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (err) {
    iziToast.error({
      position: 'topRight',
      title: 'Помилка',
      message: err.message || err,
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;

  try {
    showLoader();

    const { hits } = await getImagesByQuery(query, currentPage);
    createGallery(hits, true);

    // Плавний скрол на 2 висоти першої картки галереї
    if (galleryEl.firstElementChild) {
      const card = galleryEl.firstElementChild;
      const { height } = card.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }

    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.message || err,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
