import Axios from 'axios';

export const GetMovie = async (code) => {
  const movieInfo = await (await Axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${code}&with_images=true&with_cast=true`)).data.data.movie;
  const images = await Axios.get(`https://api.themoviedb.org/3/movie/${movieInfo.imdb_code}/images?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
  //   console.log(images);
  images.data.backdrops.sort((a, b) => b.width - a.width);
  return {
    titleLong: movieInfo.title_long,
    title: movieInfo.title,
    year: movieInfo.year,
    imdbCode: movieInfo.imdb_code,
    cast: movieInfo.cast,
    description: movieInfo.description_full,
    genres: movieInfo.genres,
    id: movieInfo.id,
    language: movieInfo.language,
    postImage: `https://image.tmdb.org/t/p/original/${images.data.posters[0].file_path}`,
    coverImage: `https://image.tmdb.org/t/p/original/${images.data.backdrops[0].file_path}`,
    screenshotImage: [movieInfo.large_screenshot_image1, movieInfo.large_screenshot_image2, movieInfo.large_screenshot_image3],
    runtime: movieInfo.runtime,
    codeTrailer: movieInfo.yt_trailer_code,
    torrents: movieInfo.torrents,
    rating: movieInfo.rating,
    dateUploaded: movieInfo.date_uploaded,
  };
};

// background_image: "https://yts.mx/assets/images/movies/the_bravados_1958/background.jpg"
// background_image_original: "https://yts.mx/assets/images/movies/the_bravados_1958/background.jpg"
// cast: (4) [{…}, {…}, {…}, {…}]
//character_name: "Jim Douglass"
// imdb_code: "0000060"
// name: "Gregory Peck"
// url_small_image: "https://yts.mx/assets/images/actors/thumb/nm0000060.jpg"

// date_uploaded: "2021-02-25 11:11:09"
// date_uploaded_unix: 1614247869
// description_full: "Jim Douglass (Gregory Peck) has been relentlessly pursuing the four outlaws who murdered his wife, but finds them in jail about to be hanged. While he waits to witness their execution, they escape; and the townspeople enlist Douglas' aid to recapture them."
// description_intro: "Jim Douglass (Gregory Peck) has been relentlessly pursuing the four outlaws who murdered his wife, but finds them in jail about to be hanged. While he waits to witness their execution, they escape; and the townspeople enlist Douglas' aid to recapture them."
// download_count: 5353
// genres: (2) ["Drama", "Western"]
// id: 27890
// imdb_code: "tt0051433"
// language: "en"
// large_cover_image: "https://yts.mx/assets/images/movies/the_bravados_1958/large-cover.jpg"
// large_screenshot_image1: "https://yts.mx/assets/images/movies/the_bravados_1958/large-screenshot1.jpg"
// large_screenshot_image2: "https://yts.mx/assets/images/movies/the_bravados_1958/large-screenshot2.jpg"
// large_screenshot_image3: "https://yts.mx/assets/images/movies/the_bravados_1958/large-screenshot3.jpg"
// like_count: 4
// medium_cover_image: "https://yts.mx/assets/images/movies/the_bravados_1958/medium-cover.jpg"
// medium_screenshot_image1: "https://yts.mx/assets/images/movies/the_bravados_1958/medium-screenshot1.jpg"
// medium_screenshot_image2: "https://yts.mx/assets/images/movies/the_bravados_1958/medium-screenshot2.jpg"
// medium_screenshot_image3: "https://yts.mx/assets/images/movies/the_bravados_1958/medium-screenshot3.jpg"
// mpa_rating: ""
// rating: 7
// runtime: 98
// slug: "the-bravados-1958"
// small_cover_image: "https://yts.mx/assets/images/movies/the_bravados_1958/small-cover.jpg"
// title: "The Bravados"
// title_english: "The Bravados"
// title_long: "The Bravados (1958)"
// torrents: (2) [{…}, {…}]

// date_uploaded: "2021-02-25 11:11:09"
// date_uploaded_unix: 1614247869
// hash: "69A47FC2FAF3BBC6DE748F3E552C15CAAD757871"
// peers: 54
// quality: "720p"
// seeds: 93
// size: "898.04 MB"
// size_bytes: 941663191
// type: "bluray"
// url: "https://yts.mx/torrent/download/69A47FC2FAF3BBC6DE748F3E552C15CAAD757871"

// url: "https://yts.mx/movies/the-bravados-1958"
// year: 1958
// yt_trailer_code: "NC3_qTvibH8"
