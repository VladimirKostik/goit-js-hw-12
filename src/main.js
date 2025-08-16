import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions.js';
import 'loaders.css/loaders.min.css';

const form = document.querySelector('form');
const submitBtn = form.querySelector('button[type="submit"]');
const oldText = submitBtn.textContent;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const message = formData.get('searchText').trim();

  if (!message) {
    iziToast.error({
      position: 'topRight',
      title: 'Error',
      message: 'Ви нічого не ввели!',
    });
    return;
  }

  clearGallery();
  showLoader();

  // Ставимо стан "Loading..."
  submitBtn.disabled = true;
  submitBtn.textContent = 'Loading...';
  submitBtn.classList.add('loading');

  // Показуємо "Loading..." рівно 2 секунди
  setTimeout(() => {
    getImagesByQuery(message)
      .then(images => {
        if (!images.length) {
          iziToast.error({
            position: 'topRight',
            title: 'Немає результатів',
            message: 'Нічого не знайдено',
          });
          return;
        }
        createGallery(images);
      })
      .catch(err => {
        iziToast.error({
          position: 'topRight',
          title: 'Помилка',
          message: err.message || err,
        });
      })
      .finally(() => {
        hideLoader();
        submitBtn.disabled = false;
        submitBtn.textContent = oldText;
        submitBtn.classList.remove('loading');
        e.target.reset();
      });
  }, 500);
});
