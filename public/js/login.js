/* eslint-disable */
const init = () => {
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/v1/users/login', {
        email,
        password,
      });
    } catch (err) {
      console.log(err.response.data);
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
