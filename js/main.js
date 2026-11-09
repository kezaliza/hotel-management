const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.site-menu-toggle');
const siteNavigation = document.querySelector('#site-navigation');

if (siteHeader && menuToggle && siteNavigation) {
  const closeMenu = () => {
    siteHeader.classList.remove('is-menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };

  const updateScrollState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    siteHeader.classList.toggle('is-menu-open', !isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  });

  siteNavigation.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !siteHeader.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
}

const bookingSearch = document.querySelector('#booking-search');
const statsStrip = document.querySelector('#stats-strip');

if (bookingSearch instanceof HTMLFormElement) {
  const checkIn = bookingSearch.elements.namedItem('checkIn');
  const checkOut = bookingSearch.elements.namedItem('checkOut');
  const guests = bookingSearch.elements.namedItem('guests');
  const roomType = bookingSearch.elements.namedItem('roomType');
  const status = document.querySelector('#booking-search-status');
  const fields = [checkIn, checkOut, guests, roomType];

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = formatLocalDate(new Date());
  checkIn.min = today;

  const updateCheckOutMinimum = () => {
    const minimumDate = checkIn.value ? new Date(`${checkIn.value}T00:00:00`) : new Date();
    if (checkIn.value) {
      minimumDate.setDate(minimumDate.getDate() + 1);
    }

    checkOut.min = formatLocalDate(minimumDate);
    if (checkOut.value && checkOut.value < checkOut.min) {
      checkOut.value = '';
    }
  };

  const showFieldError = (field, message) => {
    const error = document.querySelector(`#${field.id}-error`);
    field.setAttribute('aria-invalid', 'true');
    if (error) {
      error.textContent = message;
    }
  };

  const clearFieldError = (field) => {
    const error = document.querySelector(`#${field.id}-error`);
    field.removeAttribute('aria-invalid');
    if (error) {
      error.textContent = '';
    }
  };

  updateCheckOutMinimum();

  checkIn.addEventListener('change', () => {
    clearFieldError(checkIn);
    updateCheckOutMinimum();
    clearFieldError(checkOut);
  });

  fields.forEach((field) => {
    field.addEventListener('change', () => clearFieldError(field));
  });

  bookingSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    fields.forEach(clearFieldError);

    let isValid = true;
    fields.forEach((field) => {
      if (!field.value) {
        showFieldError(field, 'Please complete this field.');
        isValid = false;
      }
    });

    if (checkIn.value && checkIn.value < today) {
      showFieldError(checkIn, 'Check-in cannot be before today.');
      isValid = false;
    }

    if (checkOut.value && checkIn.value && checkOut.value <= checkIn.value) {
      showFieldError(checkOut, 'Check-out must be after check-in.');
      isValid = false;
    }

    if (!isValid) {
      const firstInvalidField = fields.find((field) => field.getAttribute('aria-invalid') === 'true');
      firstInvalidField?.focus();
      return;
    }

    const search = {
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      guests: guests.value,
      roomType: roomType.value,
    };

    try {
      localStorage.setItem('hotelBookingSearch', JSON.stringify(search));
    } catch (error) {
      status.textContent = 'Your search could not be saved. Please check your browser storage settings and try again.';
      return;
    }

    window.location.href = 'rooms.html';
  });
}

if (statsStrip) {
  const counters = statsStrip.querySelectorAll('[data-counter]');
  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) {
      return;
    }
    hasAnimated = true;

    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const suffix = counter.dataset.suffix ?? '';
      const numberFormat = new Intl.NumberFormat();
      const duration = 1400;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        counter.textContent = `${numberFormat.format(target)}${suffix}`;
        return;
      }

      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        const currentValue = Math.round(target * easedProgress);
        counter.textContent = `${numberFormat.format(currentValue)}${suffix}`;

        if (progress < 1) {
          window.requestAnimationFrame(updateCounter);
        }
      };

      window.requestAnimationFrame(updateCounter);
    });
  };

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.35 });
    statsObserver.observe(statsStrip);
  } else {
    animateCounters();
  }
}