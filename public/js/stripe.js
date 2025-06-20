/*eslint-disable*/

import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const res = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    const { url } = res.data.session;

    if (res.data.status === 'success') {
      window.location.href = url;
    } else {
      showAlert('error', 'Invalid session or missing URL');
    }
  } catch (err) {
    showAlert('error', 'Error Checking out');
  }
};
