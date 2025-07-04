/* eslint-disable */
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { bookTour } from './stripe';
import { updateSettings } from './updateSettings';

const init = () => {
  // Iinit map
  const map = document.getElementById('map');
  const userLoginForm = document.querySelector('.user-login-form');
  const logoutBtn = document.querySelector('.nav__el--logout');
  const userDataForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-settings');
  const bookTourBtn = document.querySelector('#book-tour');

  if (map) {
    const locations = JSON.parse(map.dataset.locations);
    displayMap(locations);
  }

  // Login
  if (userLoginForm) {
    userLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      login(email, password);
    });
  }

  // Lgout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
    });
  }

  // updata user settings
  if (userDataForm)
    userDataForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData();

      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);

      document.querySelector('.btn--save-settings').textContent = 'Updating...';

      await updateSettings(form, 'data');

      document.querySelector('.btn--save-settings').textContent =
        'Save settings';
    });

  if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      userPasswordForm.querySelector('.btn--save-password').textContent =
        'Updating...';

      const passwordCurrent =
        userPasswordForm.querySelector('#password-current').value;
      const password = userPasswordForm.querySelector('#password').value;
      const passwordConfirm =
        userPasswordForm.querySelector('#password-confirm').value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password',
      );

      userPasswordForm.querySelector('.btn--save-password').textContent =
        'Save password';
      userPasswordForm.querySelector('#password-current').value = '';
      userPasswordForm.querySelector('#password').value = '';
      userPasswordForm.querySelector('#password-confirm').value = '';
    });

  if (bookTourBtn) {
    bookTourBtn.addEventListener('click', async (e) => {
      e.target.textContent = 'Processing...';
      const tourId = e.target.dataset.tourId;
      await bookTour(tourId);
      e.target.textContent = 'Book tour now!';
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
