import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom';

export const SetupToken = () => {
  const location = useLocation();
  const history = useHistory();
  if (location?.search?.indexOf('?jwt=') > -1) {
    const jwt = location.search.replace('?jwt=', '');
    if (jwt) {
      localStorage.setItem('jwt', jwt);
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      return history.go('/');
    }
  }
  return history.goBack();
};
