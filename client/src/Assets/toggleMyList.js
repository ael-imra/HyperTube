import Axios from 'axios';

const toggleMyList = async (event, imdbCode) => {
  if (event === 'add') {
    await Axios.post(
      `http://localhost:1337/favorite`,
      {
        imdbID: imdbCode,
      },
      { withCredentials: true }
    );
  } else {
    await Axios.post(
      `http://localhost:1337/favorite/delete`,
      {
        imdbID: imdbCode,
      },
      { withCredentials: true }
    );
  }
};
export { toggleMyList };
