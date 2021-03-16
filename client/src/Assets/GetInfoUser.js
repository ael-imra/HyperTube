import Axios from "axios";
const GetLastMovies = async (userName) => {
  const lastMovies = await Axios.get(`/watchedMovie/lastWatchedMovies/${userName}`, { withCredentials: true });
  const listFavorite = await Axios(`/favorite/imdbID`, { withCredentials: true });
  const data =
    lastMovies.data.body instanceof Array
      ? lastMovies.data.body.map((movie, key) => ({
          image: `https://image.tmdb.org/t/p/original/${movie.movieImage}`,
          year: movie.movieRelease,
          titre: movie.movieTitle,
          description: movie.movieDescription,
          rating: movie.movieRating,
          runtime: movie.movieTime,
          genres: movie.movieGenre ? JSON.parse(movie.movieGenre) : [],
          language: movie.movieLanguage,
          imdbCode: movie.imdbID,
          id: movie.viewedID,
          isFavorite: listFavorite.data.body instanceof Array && listFavorite.data.body.findIndex((a) => a.imdbID === movie.imdbID) !== -1 ? true : false,
          isWatched: true,
        }))
      : [];
  return data;
};
export const GetUserInfo = async (userName) => {
  let userInfo;
  if (!userName) userInfo = await Axios.get(`/profile`, { withCredentials: true });
  else userInfo = await Axios.get(`/profile/${userName}`, { withCredentials: true });
  const countMoviesWatch = await Axios.get(`/watchedMovie/countUserWatchedMovies/${userInfo.data.body.userName}`, { withCredentials: true });
  const countFavorite = await Axios.get(`/favorite/count/${userInfo.data.body.userName}`, { withCredentials: true });
  return {
    ...userInfo.data.body,
    countMoviesWatch: countMoviesWatch.data.body,
    countFavorite: countFavorite.data.body,
    isProfileOfYou: userName ? false : true,
    listMovies: await GetLastMovies(userInfo.data.body.userName),
  };
};
export const UpdateUser = async (setUpdate, dataUser, setError, lang) => {
  const updateData = await Axios.put(
    `/profile`,
    {
      userName: dataUser.userName,
      email: dataUser.email,
      firstName: dataUser.firstName,
      lastName: dataUser.lastName,
    },
    { withCredentials: true }
  );
  if (updateData.data.type === "success") {
    setUpdate({ ...dataUser, middleware: true, fixFirstName: dataUser.firstName, fixLastName: dataUser.lastName, fixEmailName: dataUser.email, fixUserName: dataUser.userName });
  }
  setError({
    type: updateData.data.type,
    content: updateData.data.body[lang],
    state: true,
  });
};
