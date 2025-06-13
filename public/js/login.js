/* eslint-disable */

export const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/users/login', {
      email,
      password,
    });

    if (res.data.status === 'success') {
      alert('Logged in successfully');
      window.location.href = '/';
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};
