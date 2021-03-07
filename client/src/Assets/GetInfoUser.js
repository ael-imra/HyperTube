import Axios from 'axios';
export const GetUserInfo = async () => {
  const userInfo = await Axios.get(`/profile`, { withCredentials: true });
  return userInfo.data.body;
};
export const UpdateUser = async (setUpdate, dataUser, setError) => {
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
  if (updateData.data.type === 'success') {
    console.log('success === ', updateData.data.type);
    setUpdate({ ...dataUser, middleware: true, fixFirstName: dataUser.firstName, fixLastName: dataUser.lastName, fixEmailName: dataUser.email, fixUserName: dataUser.userName });
  }
  setError({
    type: updateData.data.type,
    content: updateData.data.body,
    state: true,
  });
};
