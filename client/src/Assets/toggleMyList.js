import Axios from 'axios';

const toggleMyList = async (event, imdbCode) => {
  if (event === 'add') {
    const test = await Axios.post(
      `http://localhost:1337/favorite`,
      {
        imdbID: imdbCode,
      },
      { withCredentials: true }
    );
    console.log(test);
  }
};
export { toggleMyList };
