import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
const loadMoreEl = document.querySelector('.load-more');
let lightbox;

export function createGallery(images = [], append = false) {
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <ul class="info">
          <li><b>Likes:</b> ${likes}</li>
          <li><b>Views:</b> ${views}</li>
          <li><b>Comments:</b> ${comments}</li>
          <li><b>Downloads:</b> ${downloads}</li>
        </ul>
      </div>`
    )
    .join('');

  if (append) {
    galleryEl.insertAdjacentHTML('beforeend', markup);
  } else {
    galleryEl.innerHTML = markup;
  }

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader() {
  loaderEl.classList.remove('is-hidden');
}

export function hideLoader() {
  loaderEl.classList.add('is-hidden');
}

export function showLoadMoreButton() {
  loadMoreEl.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  loadMoreEl.classList.add('is-hidden');
}