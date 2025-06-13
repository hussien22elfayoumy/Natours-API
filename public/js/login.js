/* eslint-disable */
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/users/login', {
      email,
      password,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      window.setTimeout(() => (window.location.href = '/'), 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
