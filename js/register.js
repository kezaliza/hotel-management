(() => {
  const form = document.querySelector('#register-form');
  const errorMessage = document.querySelector('#register-error');
  if (!form || !errorMessage) {
    return;
  }

  const customersKey = 'hotelCustomers';
  const customerKey = 'hotelCustomer';

  const setError = (message) => {
    errorMessage.textContent = message;
    errorMessage.hidden = !message;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    const name = form.elements.namedItem('name').value.trim();
    const email = form.elements.namedItem('email').value.trim().toLowerCase();
    const phone = form.elements.namedItem('phone').value.trim();
    if (!name || !email) {
      setError('Enter your name and a valid email address.');
      return;
    }

    let customers;
    try {
      const stored = localStorage.getItem(customersKey);
      customers = stored === null ? [] : JSON.parse(stored);
      if (!Array.isArray(customers)) {
        throw new TypeError('Customer profiles must be saved as a list.');
      }
    } catch (error) {
      setError('Your saved profiles could not be read from this browser. Check your browser storage and try again.');
      return;
    }

    if (customers.some((customer) => typeof customer?.email === 'string'
      && customer.email.trim().toLowerCase() === email)) {
      setError('A profile already exists for this email. Please sign in to your account instead.');
      return;
    }

    const customer = {
      id: `customer-${email}`,
      name,
      email,
      phone,
    };

    try {
      localStorage.setItem(customersKey, JSON.stringify([...customers, customer]));
    } catch (error) {
      setError('Your profile could not be saved. Check your browser storage settings and try again.');
      return;
    }

    try {
      localStorage.setItem(customerKey, JSON.stringify(customer));
    } catch (error) {
      setError('Your profile was saved, but sign-in could not be started. Please sign in from the account page.');
      return;
    }

    window.location.assign('account.html');
  });
})();
