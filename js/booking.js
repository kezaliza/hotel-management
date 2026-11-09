(() => {
  const form = document.querySelector('#reservation-form');
  const formColumn = document.querySelector('#booking-form-column');
  const roomSelect = document.querySelector('#booking-room');
  const checkInInput = document.querySelector('#booking-check-in');
  const checkOutInput = document.querySelector('#booking-check-out');
  const guestSelect = document.querySelector('#booking-guests');
  const guestNameInput = document.querySelector('#guest-name');
  const emailInput = document.querySelector('#guest-email');
  const phoneInput = document.querySelector('#guest-phone');
  const specialRequestsInput = document.querySelector('#special-requests');
  const formError = document.querySelector('#booking-form-error');
  const submitButton = document.querySelector('#confirm-booking');
  const summaryImage = document.querySelector('#summary-room-image');
  const summaryThumbnails = document.querySelector('#summary-room-thumbnails');
  const summaryRoomName = document.querySelector('#summary-room-name');
  const summaryNightlyPrice = document.querySelector('#summary-nightly-price');
  const summaryCheckIn = document.querySelector('#summary-check-in');
  const summaryCheckOut = document.querySelector('#summary-check-out');
  const summaryNights = document.querySelector('#summary-nights');
  const summaryGuests = document.querySelector('#summary-guests');
  const summarySubtotal = document.querySelector('#summary-subtotal');
  const summaryTax = document.querySelector('#summary-tax');
  const summaryTotal = document.querySelector('#summary-total');

  if (!form || !formColumn || !roomSelect || !checkInInput || !checkOutInput || !guestSelect) {
    return;
  }

  const formatPrice = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (value) => {
    if (!value) {
      return '—';
    }

    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(year, month - 1, day));
  };

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const safeImageUrl = (value) => {
    try {
      const parsedUrl = new URL(value, window.location.href);
      const isRelativePath = !/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith('//');
      return parsedUrl.protocol === 'https:'
        || (isRelativePath && parsedUrl.origin === window.location.origin)
        ? parsedUrl.href
        : '';
    } catch {
      return '';
    }
  };

  const today = formatDateInput(new Date());
  checkInInput.min = today;

  const showError = (element, message) => {
    const error = document.querySelector(`#${element.id}-error`);
    element.setAttribute('aria-invalid', 'true');
    if (error) {
      error.textContent = message;
    }
  };

  const clearError = (element) => {
    const error = document.querySelector(`#${element.id}-error`);
    element.removeAttribute('aria-invalid');
    if (error) {
      error.textContent = '';
    }
  };

  const showPaymentError = (message) => {
    const paymentGroup = document.querySelector('.booking-payment');
    const error = document.querySelector('#payment-method-error');
    paymentGroup?.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) {
      error.textContent = message;
    }
  };

  const setFormError = (message) => {
    formError.textContent = message;
    formError.hidden = !message;
  };

  const setCheckoutMinimum = () => {
    if (checkInInput.value) {
      const earliestCheckout = new Date(`${checkInInput.value}T00:00:00`);
      earliestCheckout.setDate(earliestCheckout.getDate() + 1);
      checkOutInput.min = formatDateInput(earliestCheckout);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkOutInput.min = formatDateInput(tomorrow);
    }

    if (checkOutInput.value && checkOutInput.value < checkOutInput.min) {
      checkOutInput.value = '';
    }
  };

  const getSelectedRoom = () => availableRooms.find((room) => room.id === roomSelect.value) ?? null;

  const updateGuests = (preferredGuests = guestSelect.value) => {
    const selectedRoom = getSelectedRoom();
    const maxGuests = selectedRoom?.maxGuests ?? 0;
    guestSelect.replaceChildren(new Option('Select guests', ''));
    for (let count = 1; count <= maxGuests; count += 1) {
      guestSelect.add(new Option(`${count} ${count === 1 ? 'Guest' : 'Guests'}`, String(count)));
    }

    guestSelect.disabled = maxGuests === 0;
    if (Number(preferredGuests) > 0 && Number(preferredGuests) <= maxGuests) {
      guestSelect.value = String(preferredGuests);
    }
    clearError(guestSelect);
  };

  const updateSummary = () => {
    const selectedRoom = getSelectedRoom();
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const startDay = checkIn ? Date.parse(`${checkIn}T00:00:00Z`) : NaN;
    const endDay = checkOut ? Date.parse(`${checkOut}T00:00:00Z`) : NaN;
    const nights = Number.isFinite(startDay) && Number.isFinite(endDay) && endDay > startDay
      ? Math.round((endDay - startDay) / 86_400_000)
      : 0;
    const subtotal = selectedRoom ? selectedRoom.price * nights : 0;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    const roomImages = selectedRoom?.images?.map(safeImageUrl).filter(Boolean) ?? [];
    const coverImage = roomImages[0] ?? 'public/room-placeholder.svg';
    if (summaryImage.dataset.roomId !== selectedRoom?.id) {
      summaryImage.dataset.roomId = selectedRoom?.id ?? '';
      summaryImage.src = coverImage;
      summaryImage.dataset.fallbackSrc = selectedRoom?.image
        ? safeImageUrl(selectedRoom.image)
        : '';
      delete summaryImage.dataset.fallbackApplied;
      summaryThumbnails.replaceChildren(...roomImages.map((src, index) => {
        const thumbnail = document.createElement('button');
        thumbnail.className = `booking-summary__thumbnail${index === 0 ? ' is-active' : ''}`;
        thumbnail.type = 'button';
        thumbnail.setAttribute('aria-label', `Show room photo ${index + 1}`);
        thumbnail.setAttribute('aria-pressed', String(index === 0));
        const image = document.createElement('img');
        image.src = src;
        image.dataset.fallbackSrc = selectedRoom?.image ? safeImageUrl(selectedRoom.image) : '';
        image.alt = `${selectedRoom.name}, photo ${index + 1}`;
        image.loading = 'lazy';
        thumbnail.append(image);
        thumbnail.addEventListener('click', () => {
          delete summaryImage.dataset.fallbackApplied;
          summaryImage.src = src;
          summaryImage.alt = image.alt;
          summaryThumbnails.querySelectorAll('.booking-summary__thumbnail').forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === index);
            item.setAttribute('aria-pressed', String(itemIndex === index));
          });
        });
        return thumbnail;
      }));
      summaryImage.alt = selectedRoom ? `${selectedRoom.name}, cover photo` : 'Selected hotel room';
    }
    summaryImage.alt = selectedRoom ? selectedRoom.name : 'Selected hotel room';
    summaryRoomName.textContent = selectedRoom?.name ?? 'Select a room';
    summaryNightlyPrice.textContent = formatPrice(selectedRoom?.price ?? 0);
    summaryCheckIn.textContent = formatDateDisplay(checkIn);
    summaryCheckOut.textContent = formatDateDisplay(checkOut);
    summaryNights.textContent = String(nights);
    summaryGuests.textContent = guestSelect.value
      ? `${guestSelect.value} ${guestSelect.value === '1' ? 'guest' : 'guests'}`
      : '—';
    summarySubtotal.textContent = formatPrice(subtotal);
    summaryTax.textContent = formatPrice(tax);
    summaryTotal.textContent = formatPrice(total);
  };

  const readStoredArray = (key, label) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue === null) {
      return [];
    }
    const parsedValue = JSON.parse(savedValue);
    if (!Array.isArray(parsedValue)) {
      throw new TypeError(`Saved ${label} must be a list.`);
    }
    return parsedValue;
  };

  const restorePreviousChoices = () => {
    let savedSelection = null;
    let savedSearch = null;
    try {
      const selectionValue = localStorage.getItem('selectedHotelRoom');
      savedSelection = selectionValue ? JSON.parse(selectionValue) : null;
      const searchValue = localStorage.getItem('hotelBookingSearch');
      savedSearch = searchValue ? JSON.parse(searchValue) : null;
    } catch (error) {
      setFormError('Some saved booking details could not be loaded. Please review your selections.');
    }

    let selectedRoom = null;
    if (savedSelection && typeof savedSelection === 'object') {
      selectedRoom = availableRooms.find((room) => room.id === savedSelection.id)
        ?? availableRooms.find((room) => room.name.toLowerCase() === String(savedSelection.name ?? '').toLowerCase());

      if (!selectedRoom && typeof savedSelection.name === 'string') {
        const selectedName = savedSelection.name.toLowerCase();
        const matchingType = availableRooms.find((room) => selectedName.includes(room.type.toLowerCase()));
        selectedRoom = matchingType ?? null;
      }
    }

    if (!selectedRoom && savedSearch && typeof savedSearch.roomType === 'string') {
      const requestedType = savedSearch.roomType.toLowerCase().replaceAll('-', ' ');
      if (requestedType !== 'any') {
        selectedRoom = availableRooms.find((room) => room.type.toLowerCase() === requestedType);
      }
    }

    if (selectedRoom) {
      roomSelect.value = selectedRoom.id;
    }

    updateGuests(savedSearch?.guests);

    if (typeof savedSearch?.checkIn === 'string' && savedSearch.checkIn >= today) {
      checkInInput.value = savedSearch.checkIn;
    }
    setCheckoutMinimum();
    if (
      typeof savedSearch?.checkOut === 'string'
      && savedSearch.checkOut > checkInInput.value
      && savedSearch.checkOut >= checkOutInput.min
    ) {
      checkOutInput.value = savedSearch.checkOut;
    }
  };

  const validateField = (field) => {
    clearError(field);
    if (!field.value.trim()) {
      showError(field, 'This field is required.');
      return false;
    }

    if (field === checkInInput && field.value < today) {
      showError(field, 'Check-in cannot be in the past.');
      return false;
    }

    if (field === checkOutInput) {
      if (field.value < checkOutInput.min) {
        showError(field, 'Check-out must be after check-in.');
        return false;
      }
      if (checkInInput.value && field.value <= checkInInput.value) {
        showError(field, 'Check-out must be after check-in.');
        return false;
      }
    }

    if (field === roomSelect && !getSelectedRoom()) {
      showError(field, 'Please choose an available room.');
      return false;
    }

    if (field === guestSelect) {
      const selectedRoom = getSelectedRoom();
      if (!selectedRoom || Number(field.value) > selectedRoom.maxGuests) {
        showError(field, 'Choose a guest count allowed for this room.');
        return false;
      }
    }

    if (field === guestNameInput && !field.value.trim()) {
      showError(field, 'Please enter your full name.');
      return false;
    }

    if (field === emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim())) {
      showError(field, 'Enter a valid email address.');
      return false;
    }

    if (field === phoneInput && field.value.replace(/\D/g, '').length < 10) {
      showError(field, 'Phone number must contain at least 10 digits.');
      return false;
    }

    return true;
  };

  const requiredFields = [
    roomSelect,
    checkInInput,
    checkOutInput,
    guestSelect,
    guestNameInput,
    emailInput,
    phoneInput,
  ];

  const validateForm = () => {
    let isValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    const paymentSelected = form.querySelector('input[name="paymentMethod"]:checked');
    showPaymentError(paymentSelected ? '' : 'Choose a payment method.');
    if (!paymentSelected) {
      isValid = false;
    }
    return isValid;
  };

  const hasOverlappingBooking = (existingBookings, selectedRoom, checkIn, checkOut) => existingBookings.some((booking) => (
    booking
    && booking.roomId === selectedRoom.id
    && String(booking.status).toLowerCase() !== 'cancelled'
    && typeof booking.checkIn === 'string'
    && typeof booking.checkOut === 'string'
    && checkIn < booking.checkOut
    && checkOut > booking.checkIn
  ));

  const createBookingId = (existingBookings, year) => {
    const prefix = `GL-${year}`;
    const maximumSequence = existingBookings.reduce((maximum, booking) => {
      const match = typeof booking?.bookingId === 'string'
        ? booking.bookingId.match(new RegExp(`^GL-${year}(\\d+)$`))
        : null;
      return match ? Math.max(maximum, Number(match[1])) : maximum;
    }, 0);
    return `${prefix}${String(maximumSequence + 1).padStart(4, '0')}`;
  };

  const showConfirmation = (booking) => {
    formColumn.innerHTML = `
      <section class="card booking-confirmation" aria-labelledby="booking-confirmation-title">
        <div class="booking-confirmation__icon"><i class="fa-solid fa-check" aria-hidden="true"></i></div>
        <h2 class="booking-confirmation__title" id="booking-confirmation-title">Booking Confirmed!</h2>
        <p class="booking-confirmation__id">Booking ID: ${escapeHtml(booking.bookingId)}</p>
        <p class="booking-confirmation__intro">Thank you, ${escapeHtml(booking.guestName)}. Your stay is confirmed.</p>
        <dl class="booking-confirmation__details">
          <div><dt>Room</dt><dd>${escapeHtml(booking.roomName)}</dd></div>
          <div><dt>Dates</dt><dd>${escapeHtml(formatDateDisplay(booking.checkIn))} – ${escapeHtml(formatDateDisplay(booking.checkOut))}</dd></div>
          <div><dt>Nights</dt><dd>${booking.nights}</dd></div>
          <div><dt>Guests</dt><dd>${booking.guests}</dd></div>
          <div><dt>Total paid</dt><dd>${escapeHtml(formatPrice(booking.total))}</dd></div>
          <div><dt>Payment</dt><dd>${escapeHtml(booking.paymentMethod)}</dd></div>
        </dl>
        <div class="booking-confirmation__actions">
          <a class="btn btn-accent" href="index.html">Back to Home</a>
          <button class="btn btn-outline" type="button" data-print-confirmation>Print Confirmation</button>
        </div>
      </section>
    `;
    formColumn.querySelector('[data-print-confirmation]').addEventListener('click', () => window.print());
  };

  const initializeRooms = () => {
    if (typeof window.loadHotelRooms !== 'function') {
      throw new TypeError('The room catalog is not available.');
    }

    const roomCatalog = window.loadHotelRooms();
    if (!Array.isArray(roomCatalog)) {
      throw new TypeError('The room catalog must be a list.');
    }
    availableRooms = roomCatalog.filter((room) => room.status === 'Available');

    roomSelect.replaceChildren(new Option('Choose an available room', ''));
    availableRooms.forEach((room) => {
      roomSelect.add(new Option(`${room.name} — ${formatPrice(room.price)} / night`, room.id));
    });

    if (availableRooms.length === 0) {
      roomSelect.disabled = true;
      submitButton.disabled = true;
      setFormError('There are no rooms currently available to book.');
    }

    restorePreviousChoices();
    updateSummary();
  };

  let availableRooms = [];

  try {
    initializeRooms();
  } catch (error) {
    roomSelect.replaceChildren(new Option('Rooms could not be loaded', ''));
    roomSelect.disabled = true;
    submitButton.disabled = true;
    setFormError('We could not load available rooms. Please try again later.');
  }

  const onDateChange = () => {
    setCheckoutMinimum();
    clearError(checkInInput);
    clearError(checkOutInput);
    setFormError('');
    updateSummary();
  };

  roomSelect.addEventListener('change', () => {
    updateGuests();
    clearError(roomSelect);
    setFormError('');
    updateSummary();
  });

  checkInInput.addEventListener('change', onDateChange);
  checkOutInput.addEventListener('change', () => {
    clearError(checkOutInput);
    setFormError('');
    updateSummary();
  });
  guestSelect.addEventListener('change', () => {
    clearError(guestSelect);
    updateSummary();
  });

  requiredFields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });

  form.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener('change', () => showPaymentError(''));
    radio.addEventListener('blur', () => {
      if (!form.querySelector('input[name="paymentMethod"]:checked')) {
        showPaymentError('Choose a payment method.');
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setFormError('');

    if (!validateForm()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const selectedRoom = getSelectedRoom();
    let existingBookings;
    try {
      existingBookings = readStoredArray('hotelBookings', 'bookings');
    } catch (error) {
      setFormError('Existing bookings could not be checked. Please try again later.');
      return;
    }

    if (hasOverlappingBooking(existingBookings, selectedRoom, checkInInput.value, checkOutInput.value)) {
      setFormError('This room is already booked for the selected dates. Please choose different dates or another room.');
      return;
    }

    const nights = Math.round(
      (Date.parse(`${checkOutInput.value}T00:00:00Z`) - Date.parse(`${checkInInput.value}T00:00:00Z`))
      / 86_400_000,
    );
    const subtotal = selectedRoom.price * nights;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const year = new Date().getFullYear();
    const booking = {
      bookingId: createBookingId(existingBookings, year),
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      guestName: guestNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
      nights,
      guests: Number(guestSelect.value),
      specialRequests: specialRequestsInput.value.trim(),
      paymentMethod: form.querySelector('input[name="paymentMethod"]:checked').value,
      subtotal,
      tax,
      total: subtotal + tax,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('hotelBookings', JSON.stringify([...existingBookings, booking]));
    } catch (error) {
      setFormError('Your booking could not be saved. Check your browser storage settings and try again.');
      return;
    }

    showConfirmation(booking);
  });
})();