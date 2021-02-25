const { getFavorites, checkFavoriteMovie, insertFavorite, deleteFavorite } = require('../models/favoriteModel');
const { keys } = require(__dirname + '/../configs/indexConfig');
const axios = require('axios');

const getAllFavorites = async function (req, res, next) {
  try {
    const allFavorites = await getFavorites(req.user);
    if (allFavorites.length > 0)
      return res.send({
        type: 'success',
        status: 200,
        body: allFavorites,
      });
    return res.send({
      type: 'error',
      status: 403,
      body: 'Favorites not found',
    });
  } catch (err) {
    next(err);
  }
};

const addFavorite = async function (req, res, next) {
  try {
    if (typeof req.body.imdbID !== 'string' || req.body.imdbID.trim().length > 10)
      return res.send({
        type: 'error',
        status: 400,
        body: 'Incorrect imdbID',
      });
    const { found, movieTitle, movieImage } = await checkFavoriteMovie(req.body.imdbID.trim());
    if (found)
      return res.send({
        type: 'warning',
        status: 403,
        body: 'Already have this movie on favorite',
      });
    if (movieTitle && movieImage) {
      const resultInsert = await insertFavorite({
        userID: req.user,
        imdbID: req.body.imdbID.trim(),
        movieTitle,
        movieImage,
      });
      if (resultInsert.insertId)
        return res.send({
          type: 'success',
          status: 200,
          body: resultInsert.insertId,
        });
      return res.send({
        type: 'error',
        status: 403,
        body: 'Insert failed',
      });
    }
    const movie = await axios.get(`https://api.themoviedb.org/3/movie/${req.body.imdbID.trim()}?api_key=${keys.themoviedb}`);
    const { original_title, poster_path } = movie.data;
    const resultInsert = await insertFavorite({
      userID: req.user,
      imdbID: req.body.imdbID.trim(),
      movieTitle: original_title,
      movieImage: poster_path,
    });
    if (resultInsert.insertId)
      return res.send({
        type: 'success',
        status: 200,
        body: resultInsert.insertId,
      });
    return res.send({
      type: 'error',
      status: 403,
      body: 'Insert failed',
    });
  } catch (err) {
    if (err.response)
      return res.send({
        type: 'error',
        status: 403,
        body: 'Movie not found',
      });
    next(err);
  }
};

const removeFavorite = async function (req, res, next) {
  try {
    if (typeof req.body.imdbID !== 'string' || req.body.imdbID.trim().length > 10)
      return res.send({
        type: 'error',
        status: 400,
        body: 'Incorrect imdbID',
      });
    const deleteResult = await deleteFavorite(req.body.imdbID.trim(), req.user);
    if (deleteResult)
      return res.send({
        type: 'success',
        status: 200,
        body: 'Deleted successful',
      });
    return res.send({
      type: 'error',
      status: 403,
      body: 'Deleted failed',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFavorites,
  addFavorite,
  removeFavorite,
};
