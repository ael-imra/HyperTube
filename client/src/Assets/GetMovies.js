import Axios from 'axios'
export const GetMovies = async (page, oldValue, search) => {
	let { rating, order, genre, title, sort } = search
	if (sort === '') sort = 'download_count'
	if (genre === 'All') genre = ''
	if (sort === 'rating' && rating === 0) rating = 0.1
	const movies = await Axios.get(`/movie?page=${page}&minRating=${rating}&genre=${genre}&query=${title}&sort=${sort}&order=${order}`, { withCredentials: true })
	movies.data.body.list = [...oldValue, ...movies.data.body.list.filter((movie) => oldValue.findIndex((element) => element.id === movie.id) === -1)]
	return movies.data.body
}
