const axios = require('axios');


async function getPhimList(Page = 1) {
  try {
    const response = await axios.get(`${process.env.MOVIE_API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${Page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching phim list:', error);
    throw error;
  }
}

async function getPhimDetail(slug){
  try{
    const res = await axios.get(`${process.env.MOVIE_API_BASE_URL}/phim/${slug}`)
    return res.data
  }catch(error){
    console.log('Lấy chi tiết phim thất bại', error)
  }
}

async function getChuDe(chuDe, Page = 1 ){
  try{
    const res = await axios.get(`${process.env.MOVIE_API_BASE_URL}/v1/api/danh-sach/${chuDe}?page=${Page}&sort_field=year&sort_type=desc&sort_lang=&category=&country=&year=&limit=50`)
    return res.data
  }catch(error){
    console.log('Lấy chi tiết phim thất bại', error)
  }
}



async function getCategory() {
  try{
    const res = await axios.get(`${process.env.MOVIE_API_BASE_URL}/the-loai`)
    return res.data
  }catch(error){
    console.error('Error fetching Category list:', error);
    throw error;
  }
}

async function getFilmCategory(category, page) {
  try{
    const res = await axios.get(`${process.env.MOVIE_API_BASE_URL}/v1/api/the-loai/${category}?page=${page}&sort_field=year&sort_type=desc&sort_lang=&country=&year=&limit=50`)
    return res.data
  }catch(error){
    console.error('Error fetching Category list:', error);
    throw error;
  }
}

async function getCountryCategory(country, page) {
  try{
    const res = await axios.get(`${process.env.MOVIE_API_BASE_URL}/v1/api/quoc-gia/${country}?page=${page}&sort_field=year&sort_type=desc&sort_lang=&category=&year=&limit=50`)
    return res.data
  }catch(error){
    console.error('Error fetching Category list:', error);
    throw error;
  }
}

async function getCountry() {
  try{
    const res = await axios.get(`${process.env.MOVIE_API_BASE_URL}/quoc-gia`)
    return res.data
  }catch(error){
    console.error('Error fetching Category list:', error);
    throw error;
  }
}

async function search(keyword, page) {
  try{
    const res = await axios.get(`${process.env.MOVIE_API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}&sort_field=year&sort_type=desc&sort_lang=&category=&country=&year=&limit=50`)
    return res.data
  }catch(error){
    console.error('Error fetching Category list:', error);
    throw error;
  }
}

module.exports = {
  getPhimList,
  getPhimDetail,
  getCategory,
  getCountry,
  getChuDe,
  getFilmCategory,
  getCountryCategory,
  search
};