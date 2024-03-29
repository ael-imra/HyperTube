const fs = require('fs');
const {
  insertMovie,
  insertWatchedMovie,
  updateWatchedMovie,
  updateMovie,
  checkViewed,
  getMovieDBInfo,
} = require('../models/movieModel');
const { downloadStream, convertStream, getFileStream } = require('../services/streamService');
const path = require('path');
const { getMovieInfo } = require('../services/movieService');

const stream = async function (movie, req, res, next) {
  try {
    const { torrentHash, imdbID } = req.params;
    let streamObject = { file: fs.createReadStream(__dirname + '/../downloads/videos/video.mp4') };
    // if (!movie.isDownloaded)
    // 	streamObject = await downloadStream(torrentHash, () => {
    // 		updateMovie({ isDownloaded: true }, imdbID, torrentHash)
    // 	})
    // else streamObject = await getFileStream(movie.path)
    // if (streamObject.err)
    // 	return res.send({
    // 		type: 'error',
    // 		status: 403,
    // 		body: { Eng: 'Error to find Movie', Fr: 'Erreur de recherche du film' },
    // 	})
    // const checkViewedMovie = await checkViewed(imdbID, req.user)
    // if (!checkViewedMovie) {
    // 	const movieDB = await getMovieDBInfo(imdbID)
    // 	if (!movieDB) {
    // 		const { original_title, poster_path, vote_average, overview, runtime, original_language, genres, release_date } = await getMovieInfo(imdbID)
    // 		if (overview) {
    // 			const movieGenre = []
    // 			if (genres) for (const value of genres) movieGenre.push(value.name)
    // 			insertWatchedMovie({
    // 				userID: req.user,
    // 				imdbID: imdbID,
    // 				movieTitle: original_title,
    // 				movieRating: vote_average,
    // 				movieImage: poster_path,
    // 				movieDescription: [...overview].splice(0, 1024).toString().replaceAll(',', ''),
    // 				movieTime: runtime,
    // 				movieLanguage: original_language,
    // 				movieGenre: JSON.stringify(movieGenre),
    // 				movieRelease: new Date(release_date).getFullYear(),
    // 			})
    // 		}
    // 	} else
    // 		insertWatchedMovie({
    // 			userID: req.user,
    // 			imdbID: movieDB.imdbID,
    // 			movieTitle: movieDB.movieTitle,
    // 			movieRating: movieDB.movieRating,
    // 			movieImage: movieDB.movieImage,
    // 			movieDescription: movieDB.movieDescription,
    // 			movieTime: movieDB.movieTime,
    // 			movieLanguage: movieDB.movieLanguage,
    // 			movieGenre: movieDB.movieGenre,
    // 			movieRelease: movieDB.movieRelease,
    // 		})
    // } else updateWatchedMovie(imdbID, req.user)
    // const ext = path.extname(streamObject.file.name).replace('.', '')
    // if (!Object.keys(movie).length) {
    // 	insertMovie({
    // 		torrentHash,
    // 		imdbID,
    // 		path: streamObject.file.path,
    // 	})
    // }
    // const { range } = req.headers
    // if (!streamObject.needConvert) {
    // 	if (range) {
    // 		const parts = range.replace('bytes=', '').split('-')
    // 		const start = parseInt(parts[0])
    // 		const end = parts[1] ? parseInt(parts[1]) : streamObject.file.length - 1
    // 		const chunkSize = end - start + 1
    // 		const header = {
    // 			'Content-Range': `bytes ${start}-${end}/${streamObject.file.length}`,
    // 			'Accept-Ranges': 'bytes',
    // 			'Content-Length': chunkSize,
    // 			'Content-Type': `video/${ext}`,
    // 		}
    // 		const streamFile = streamObject.file.createReadStream({
    // 			start,
    // 			end,
    // 		})
    // 		res.writeHead(206, header)
    // 		return streamFile.pipe(res)
    // 	}
    // 	const header = {
    // 		'Content-Length': streamObject.file.length,
    // 		'Content-Type': `video/${ext}`,
    // 	}
    // 	const streamFile = streamObject.file.createReadStream()
    // 	res.writeHead(206, header)
    // 	return streamFile.pipe(res)
    // }
    // const { err, streamFile } = await convertStream(streamObject.file);
    // if (err)
    //   return res.send({
    //     type: "error",
    //     status: 403,
    //     body: { Eng: "Error to convert Movie", Fr: "Erreur de conversion du film" },
    //   });
    return streamObject.file.pipe(res);
  } catch (err) {
    return res.send({
      type: 'error',
      status: 403,
      body: { Eng: 'Movie not found', Fr: 'Film introuvable' },
    });
  }
};

module.exports = {
  stream,
};
