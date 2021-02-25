import Axios from 'axios';

const authRegister = async (body) => {
  const result = await Axios.post(`/auth/register`, body, { withCredentials: true });

  return result.data;
};
const authLogin = async (body) => {
  const result = await Axios.post(`/auth/login`, body, { withCredentials: true });

  return result.data;
};

export { authRegister, authLogin };
