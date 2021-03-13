const { getMovie } = require(__dirname + '/../models/movieModel')
const { stream } = require(__dirname + '/streamController')
const axios = require('axios')

const getOneMovie = async function (req, res, next) {
	try {
		const { imdbID, torrentHash } = req.params
		if (typeof imdbID !== 'string' || typeof torrentHash !== 'string' || imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: { Eng: 'Incorrect parameters', Fr: 'Paramètres incorrects' },
			})
		const movie = await getMovie(imdbID, torrentHash)
		return stream(movie, req, res, next)
	} catch (err) {
		next(err)
	}
}
const getMovieInfo = async function (req, res, next) {
	try {
		const { imdbID } = req.params
		if (typeof imdbID === 'string') {
			const codeMovie = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${imdbID}`)
			const movieInfo = await (await axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${codeMovie.data.data.movies[0].id}&with_images=true&with_cast=true`)).data
				.data.movie
			const images = await axios.get(`https://api.themoviedb.org/3/movie/${movieInfo.imdb_code}/images?api_key=7a518fe1d1c5359a4929ef4765c347fb`)
			const movies = await axios.get(`https://yts.mx/api/v2/movie_suggestions.json?movie_id=${codeMovie.data.data.movies[0].id}`)
			let suggestions = movies.data.data.movies
			const listFavorite = await axios(`/favorite/imdbID`, { withCredentials: true })
			const countWatchedMovies = await axios.get(`/movie/${movieInfo.imdb_code}`, { withCredentials: true })
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
			}))
			images.data.backdrops.sort((a, b) => b.width - a.width)
			return res.send({
				type: 'error',
				status: 400,
				body: {
					titleLong: movieInfo.title_long,
					title: movieInfo.title,
					year: movieInfo.year,
					imdbCode: movieInfo.imdb_code,
					cast: movieInfo.cast instanceof Array ? movieInfo.cast : [],
					description: movieInfo.description_full,
					genres: movieInfo.genres,
					id: movieInfo.id,
					language: movieInfo.language,
					postImage: `https://image.tmdb.org/t/p/original/${images.data.posters[0].file_path}`,
					coverImage:
						images.data.backdrops.length && images.data.backdrops[0].hasOwnProperty('file_path')
							? `https://image.tmdb.org/t/p/original/${images.data.backdrops[0].file_path}`
							: '',
					screenshotImage: [movieInfo.large_screenshot_image1, movieInfo.large_screenshot_image2, movieInfo.large_screenshot_image3],
					runtime: movieInfo.runtime,
					codeTrailer: movieInfo.yt_trailer_code,
					torrents: movieInfo.torrents.map((item) => ({ quality: item.quality, hash: item.hash, type: item.type })),
					rating: movieInfo.rating,
					dateUploaded: movieInfo.date_uploaded,
					suggestions,
					isFavorite: listFavorite.data.body instanceof Array && listFavorite.data.body.findIndex((a) => a.imdbID === movieInfo.imdb_code) !== -1 ? true : false,
					countWatchedMovies: countWatchedMovies.data.body,
				},
			})
		}
		return res.send({
			type: 'error',
			status: 400,
			body: { Eng: 'Incorrect parameters', Fr: 'Paramètres incorrects' },
		})
	} catch (err) {
		getMovieInfoBackup(req, res, next)
	}
}
const getMovieInfoBackup = async function (req, res, next) {
	try {
		const { imdbID } = req.params
		const movie = await axios.get(`https://api.apipop.net/movie?cb=480p,720p,1080p,3d&page=1&imdb=${imdbID}`)
		const movieInfo = movie.data
		const images = await axios.get(`https://api.themoviedb.org/3/movie/${movieInfo.imdb}/images?api_key=7a518fe1d1c5359a4929ef4765c347fb`)
		const credits = await axios.get(`https://api.themoviedb.org/3/movie/${movieInfo.imdb}/credits?api_key=7a518fe1d1c5359a4929ef4765c347fb`)
		credits.data.cast = credits.data.cast.map((cst) => ({
			name: cst.name,
			character_name: cst.character,
			url_small_image: `https://image.tmdb.org/t/p/original/${cst.profile_path}`,
			imdb_code: cst.id,
		}))
		credits.data.cast.length = credits.data.cast.length > 5 ? 5 : credits.data.cast.length
		let suggestions = []
		const listFavorite = await axios(`/favorite/imdbID`, { withCredentials: true })
		const countWatchedMovies = await axios.get(`/movie/${movieInfo.imdb}`, { withCredentials: true })
		images.data.backdrops.sort((a, b) => b.width - a.width)
		return res.send({
			type: 'error',
			status: 400,
			body: {
				titleLong: 'None',
				title: movieInfo.title,
				year: movieInfo.year,
				imdbCode: movieInfo.imdb,
				cast: credits.data.cast instanceof Array ? credits.data.cast : [],
				description: movieInfo.description,
				genres: movieInfo.genres,
				id: movieInfo.id,
				language: movieInfo.language,
				postImage: `https://image.tmdb.org/t/p/original/${images.data.posters[0].file_path}`,
				coverImage:
					images.data.backdrops.length && images.data.backdrops[0].hasOwnProperty('file_path')
						? `https://image.tmdb.org/t/p/original/${images.data.backdrops[0].file_path}`
						: '',
				screenshotImage: [],
				runtime: movieInfo.runtime,
				codeTrailer: movieInfo.trailer,
				torrents: movieInfo.items.map((item) => ({ quality: item.quality, hash: item.id, type: '' })),
				rating: movieInfo.rating,
				suggestions,
				isFavorite: listFavorite.data.body instanceof Array && listFavorite.data.body.findIndex((a) => a.imdbID === movieInfo.imdb) !== -1 ? true : false,
				countWatchedMovies: countWatchedMovies.data.body,
			},
		})
	} catch (err) {
		next(err)
	}
}
module.exports = {
	getOneMovie,
	getMovieInfo,
}
