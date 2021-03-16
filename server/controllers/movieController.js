const { getMovie, getCountWatchedMovie, getWatchedMovies } = require(__dirname + '/../models/movieModel');
const { getFavorites } = require(__dirname + '/../models/favoriteModel');
const { stream } = require(__dirname + '/streamController');
const { getMovieImagesAndCasts } = require(__dirname + '/../services/movieService');
const axios = require('axios');

const getOneMovie = async function (req, res, next) {
    try {
        const { imdbID, torrentHash } = req.params;
        if (typeof imdbID !== 'string' || typeof torrentHash !== 'string' || imdbID.length > 10)
            return res.send({
                type: 'error',
                status: 400,
                body: { Eng: 'Incorrect parameters', Fr: 'Paramètres incorrects' },
            });
        const movie = await getMovie(imdbID, torrentHash);
        return stream(movie, req, res, next);
    } catch (err) {
        next(err);
    }
};
const getMovieInfo = async function (req, res, next) {
    try {
        const { imdbID } = req.params;
        if (typeof imdbID === 'string') {
            const codeMovie = await axios.get(`https://yts.megaproxy.info/api/v2/list_movies.json?query_term=${imdbID}`);
            const movieData = await axios.get(`https://yts.megaproxy.info/api/v2/movie_details.json?movie_id=${codeMovie.data.data.movies[0].id}&with_images=true`);
            const movieInfo = movieData.data.data.movie;
            const { images, credits } = await getMovieImagesAndCasts(imdbID);
            const movies = await axios.get(`https://yts.megaproxy.info/api/v2/movie_suggestions.json?movie_id=${codeMovie.data.data.movies[0].id}`);
            let suggestions = movies.data.data.movies;
            suggestions = suggestions.map((movie) => ({
                image: movie.medium_cover_image,
                id: movie.id,
                titre: movie.title,
                year: movie.year,
                runtime: movie.runtime,
                rating: movie.rating,
                language: movie.language,
                genres: movie.genres,
                description: movie.description_full,
                imdbCode: movie.imdb_code,
            }));
            const listFavorite = await getFavorites(req.user, 'imdbID');
            const countWatchedMovies = await getCountWatchedMovie(movieInfo.imdb_code);
            return res.send({
                type: 'success',
                status: 200,
                body: {
                    titleLong: movieInfo.title_long,
                    title: movieInfo.title,
                    year: movieInfo.year,
                    imdbCode: movieInfo.imdb_code,
                    cast: credits && credits.data.cast instanceof Array ? credits.data.cast : [],
                    description: movieInfo.description_full,
                    genres: movieInfo.genres,
                    id: movieInfo.id,
                    language: movieInfo.language,
                    postImage: images ? `https://image.tmdb.org/t/p/original/${images.data.posters[0].file_path}` : '',
                    coverImage:
                        images && images.data.backdrops.length && images.data.backdrops[0].hasOwnProperty('file_path')
                            ? `https://image.tmdb.org/t/p/original/${images.data.backdrops[0].file_path}`
                            : '',
                    runtime: movieInfo.runtime,
                    codeTrailer: movieInfo.yt_trailer_code,
                    screenshotImage: [movieInfo.large_screenshot_image1, movieInfo.large_screenshot_image2, movieInfo.large_screenshot_image3],
                    suggestions,
                    torrents: movieInfo.torrents.map((item) => ({ quality: item.quality, hash: item.hash, type: item.type })),
                    rating: movieInfo.rating,
                    dateUploaded: movieInfo.date_uploaded,
                    isFavorite: listFavorite instanceof Array && listFavorite.findIndex((a) => a.imdbID === movieInfo.imdb_code) !== -1 ? true : false,
                    countWatchedMovies: countWatchedMovies,
                },
            });
        }
        return res.send({
            type: 'error',
            status: 400,
            body: { Eng: 'Incorrect parameters', Fr: 'Paramètres incorrects' },
        });
    } catch (err) {
        getMovieInfoBackup(req, res, next);
    }
};
const getMovieInfoBackup = async function (req, res, next) {
    try {
        const { imdbID } = req.params;
        const movie = await axios.get(`https://api.apipop.net/movie?cb=480p,720p,1080p,3d&page=1&imdb=${imdbID}`);
        const movieInfo = movie.data;
        const { images, credits } = await getMovieImagesAndCasts(imdbID);
        const listFavorite = await getFavorites(req.user, 'imdbID');
        const countWatchedMovies = await getCountWatchedMovie(movieInfo.imdb);
        return res.send({
            type: 'success',
            status: 200,
            body: {
                titleLong: 'None',
                title: movieInfo.title,
                year: movieInfo.year,
                imdbCode: movieInfo.imdb,
                cast: credits && credits.data.cast instanceof Array ? credits.data.cast : [],
                description: movieInfo.description,
                genres: movieInfo.genres,
                id: movieInfo.id,
                language: movieInfo.language,
                postImage: images ? `https://image.tmdb.org/t/p/original/${images.data.posters[0].file_path}` : '',
                coverImage:
                    images && images.data.backdrops.length && images.data.backdrops[0].hasOwnProperty('file_path')
                        ? `https://image.tmdb.org/t/p/original/${images.data.backdrops[0].file_path}`
                        : '',
                runtime: movieInfo.runtime,
                codeTrailer: movieInfo.trailer,
                screenshotImage: [],
                suggestions: [],
                torrents: movieInfo.items.map((item, index) => (index <= 5 ? { quality: item.quality, hash: item.id, type: '' } : null)),
                rating: movieInfo.rating,
                isFavorite: listFavorite instanceof Array && listFavorite.findIndex((a) => a.imdbID === movieInfo.imdb) !== -1 ? true : false,
                countWatchedMovies: countWatchedMovies,
            },
        });
    } catch (err) {
        if (err.response)
            return res.send({
                type: 'error',
                status: 400,
                body: { Eng: 'Movie not found', Fr: 'Film introuvable' },
            });
        return next(err);
    }
};
const getMoviesInfo = async function (req, res, next) {
    try {
        const { page, minRating, genre, query, sort, order } = req.query;
        let pageCounter = page;
        const movies = [];
        const listFavorite = await getFavorites(req.user, 'imdbID');
        const listWatch = await getWatchedMovies(req.user);
        while (movies.length <= 20) {
            const moviesData = await axios.get(
                `https://yts.megaproxy.info/api/v2/list_movies.json?page=${pageCounter}&minimum_rating=${minRating}&limit=30&genre=${genre}&limit=30&query_term=${query}&sort_by=${sort}&order_by=${order}`
            );
            if (!moviesData.data.data.movies) break;
            moviesData.data.data.movies.map((movie) => {
                movies.push({
                    image: movie.large_cover_image,
                    year: movie.year,
                    titre: movie.title_english,
                    description: movie.summary,
                    rating: movie.rating,
                    runtime: movie.runtime,
                    genres: movie.genres ? movie.genres : [],
                    language: movie.language,
                    imdbCode: movie.imdb_code,
                    id: movie.id,
                    isFavorite: listFavorite instanceof Array && listFavorite.findIndex((a) => a.imdbID === movie.imdb_code) !== -1 ? true : false,
                    isWatched: listWatch instanceof Array && listWatch.findIndex((a) => a.imdbID === movie.imdb_code) !== -1 ? true : false,
                });
            });
            pageCounter++;
        }
        return res.send({
            type: 'success',
            status: 200,
            body: { list: movies, page: pageCounter, next: movies.length === 30, middleware: false },
        });
    } catch (err) {
        getMoviesInfoBackup(req, res, next);
    }
};
const getMoviesInfoBackup = async function (req, res, next) {
    try {
        const { page, genre, query, sort } = req.query;
        let pageCounter = page;
        const movies = [];
        const listFavorite = await getFavorites(req.user, 'imdbID');
        const listWatch = await getWatchedMovies({ userID: req.user });
        while (movies.length <= 20) {
            const moviesData = await axios.get(`https://api.apipop.net/list?page=${pageCounter}${genre}&keywords=${query}&sort=${sort}`);
            if (!moviesData.data.MovieList) break;
            moviesData.data.MovieList.map((movie) => {
                movies.push({
                    image: movie.poster_big,
                    year: movie.year,
                    titre: movie.title,
                    description: movie.description,
                    rating: movie.rating,
                    runtime: movie.runtime,
                    genres: movie.genres,
                    language: 'none',
                    imdbCode: movie.imdb,
                    id: movie.id,
                    isFavorite: listFavorite instanceof Array && listFavorite.findIndex((a) => a.imdbID === movie.imdb_code) !== -1 ? true : false,
                    isWatched: listWatch instanceof Array && listWatch.findIndex((a) => a.imdbID === movie.imdb_code) !== -1 ? true : false,
                });
            });
            pageCounter++;
        }
        return res.send({
            type: 'success',
            status: 200,
            body: { list: movies, page: pageCounter, next: movies.length === 75, middleware: false },
        });
    } catch (err) {
        if (err.response)
            return res.send({
                type: 'error',
                status: 400,
                body: { list: [], page: 0, next: false, middleware: false },
            });
        return next(err);
    }
};
module.exports = {
    getOneMovie,
    getMovieInfo,
    getMoviesInfo,
};
