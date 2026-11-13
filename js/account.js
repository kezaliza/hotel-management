(() => {
  const loginForm = document.querySelector('#account-login-form');
  const loginPanel = document.querySelector('#account-login');
  const accountContent = document.querySelector('#account-content');
  if (!loginForm || !loginPanel || !accountContent) {
    return;
  }

  const customerKey = 'hotelCustomer';
  const bookingsKey = 'hotelBookings';
  const reviewsKey = 'hotelReviews';
  const loginError = document.querySelector('#account-login-error');
  const dataError = document.querySelector('#account-data-error');
  const bookingsList = document.querySelector('#account-bookings-list');
  const bookingsEmpty = document.querySelector('#account-bookings-empty');
  const reviewsList = document.querySelector('#account-reviews-list');
  const reviewsEmpty = document.querySelector('#account-reviews-empty');

  const readStoredArray = (key) => {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return [];
    }
    const value = JSON.parse(stored);
    if (!Array.isArray(value)) {
      throw new TypeError(`${key} must contain a list.`);
    }
    return value;
  };

  const setError = (element, message) => {
    element.textContent = message;
    element.hidden = !message;
  };

  const renderBookings = (customer) => {
    const bookings = readStoredArray(bookingsKey)
      .filter((booking) => typeof booking?.email === 'string'
        && booking.email.trim().toLowerCase() === customer.email.toLowerCase())
      .sort((left, right) => String(right.checkIn || '').localeCompare(String(left.checkIn || '')));
    bookingsList.replaceChildren();
    bookingsEmpty.hidden = bookings.length > 0;

    bookings.forEach((booking) => {
      const card = document.createElement('article');
      card.className = 'card account-booking';
      const heading = document.createElement('div');
      heading.className = 'account-booking__heading';
      const room = document.createElement('h3');
      room.textContent = booking.roomName || 'Hotel booking';
      const status = document.createElement('span');
      status.className = 'account-booking__status';
      status.textContent = booking.status || 'Status unavailable';
      heading.append(room, status);
      const details = document.createElement('p');
      details.textContent = `Booking ${booking.bookingId || '—'} · ${booking.checkIn || '—'} to ${booking.checkOut || '—'}`;
      card.append(heading, details);

      if (String(booking.status || '').trim().toLowerCase() === 'checked-out') {
        const writeReview = document.createElement('a');
        writeReview.className = 'btn btn-accent';
        writeReview.href = 'reviews.html?service=Room#write-review';
        writeReview.textContent = 'Write a Review';
        card.append(writeReview);
      }
      bookingsList.append(card);
    });
  };

  const renderReviews = (customer) => {
    const reviews = readStoredArray(reviewsKey)
      .filter((review) => review && review.userId === customer.id)
      .sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
    window.hotelReviews.renderReviewCards(reviewsList, reviews);
    reviewsEmpty.hidden = reviews.length > 0;
  };

  const renderAccount = () => {
    let customer;
    try {
      customer = window.hotelReviews.getCurrentCustomer();
      if (!customer) {
        loginPanel.hidden = false;
        accountContent.hidden = true;
        return;
      }
      loginPanel.hidden = true;
      accountContent.hidden = false;
      document.querySelector('#account-customer-name').textContent = customer.name;
      document.querySelector('#account-customer-email').textContent = customer.email;
      setError(dataError, '');
      renderBookings(customer);
      renderReviews(customer);
    } catch (error) {
      setError(dataError, 'Your account data could not be loaded from browser storage.');
    }
  };

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) {
      return;
    }
    const name = loginForm.elements.namedItem('name').value.trim();
    const email = loginForm.elements.namedItem('email').value.trim().toLowerCase();
    if (!name || !email) {
      setError(loginError, 'Enter your name and a valid email address.');
      return;
    }
    try {
      const customer = {
        id: `customer-${email}`,
        name,
        email,
      };
      localStorage.setItem(customerKey, JSON.stringify(customer));
      setError(loginError, '');
      renderAccount();
    } catch (error) {
      setError(loginError, 'Your demo sign-in could not be saved. Check your browser storage settings and try again.');
    }
  });

  document.querySelector('#account-logout').addEventListener('click', () => {
    try {
      localStorage.removeItem(customerKey);
      renderAccount();
    } catch (error) {
      setError(dataError, 'You could not be signed out. Check your browser storage settings and try again.');
    }
  });

  document.querySelector('.account-tabs').addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }
    const showBookings = tab.id === 'account-bookings-tab';
    document.querySelector('#account-bookings-tab').setAttribute('aria-selected', String(showBookings));
    document.querySelector('#account-reviews-tab').setAttribute('aria-selected', String(!showBookings));
    document.querySelector('#account-bookings-tab').classList.toggle('is-active', showBookings);
    document.querySelector('#account-reviews-tab').classList.toggle('is-active', !showBookings);
    document.querySelector('#account-bookings-panel').hidden = !showBookings;
    document.querySelector('#account-reviews-panel').hidden = showBookings;
  });

  window.addEventListener('storage', (event) => {
    if ([customerKey, bookingsKey, reviewsKey].includes(event.key)) {
      renderAccount();
    }
  });

  renderAccount();
})();
