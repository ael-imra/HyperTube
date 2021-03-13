import axios from 'axios'
import Axios from 'axios'

export const GetMovie = async (code) => {
	const movieInfo = await Axios.get(`/movie/${code}`, { withCredentials: true })
	return movieInfo.data.body
}
