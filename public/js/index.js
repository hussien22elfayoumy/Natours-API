/* eslint-disable */
import { displayMap } from './leaflet';
import { login } from './login';

const init = () => {
  // Iinit map
  const map = document.getElementById('map');
  const form = document.querySelector('.form');

  if (map) {
    const locations = JSON.parse(map.dataset.locations);
    displayMap(locations);
  }

  // Login functionality
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      login(email, password);
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
