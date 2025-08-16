import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '51706817-4b5d2cc21e6cd3f5251979b08';

export const perPage = 15;

export async function getImagesByQuery(query, page = 1) {
  try {
    const { data } = await axios.get('', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: perPage,
      },
    });
    
    return data;
  } catch (error) {
    
    throw error;
  }
}