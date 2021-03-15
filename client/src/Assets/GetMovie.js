import Axios from 'axios';

export const GetMovie = async (code) => {
    const movieInfo = await Axios.get(`/movie/${code}`, { withCredentials: true });
    if (movieInfo.data.type === 'success') return movieInfo.data.body;
    else return 'not found';
};
