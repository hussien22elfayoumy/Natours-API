/* eslint-disable */
const init = () => {
  const login = async (email, password) => {
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

  const form = document.querySelector('.form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    login(email, password);
  });
};

document.addEventListener('DOMContentLoaded', init);
