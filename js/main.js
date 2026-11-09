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

const featuredRoomsGrid = document.querySelector('#featured-rooms-grid');
const featuredRoomsStatus = document.querySelector('#featured-rooms-status');

if (featuredRoomsGrid) {
  const favoriteButtons = [...featuredRoomsGrid.querySelectorAll('[data-favorite-room]')];
  const favoriteRoomNames = new Set(favoriteButtons.map((button) => button.dataset.favoriteRoom));
  const setFavoriteState = (button, isFavorite) => {
    const roomName = button.dataset.favoriteRoom;
    const icon = button.querySelector('i');
    button.classList.toggle('is-favorite', isFavorite);
    button.setAttribute('aria-pressed', String(isFavorite));
    button.setAttribute('aria-label', `${isFavorite ? 'Remove' : 'Add'} ${roomName} ${isFavorite ? 'from' : 'to'} favorites`);
    icon?.classList.toggle('fa-solid', isFavorite);
    icon?.classList.toggle('fa-regular', !isFavorite);
  };

  try {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteRooms') ?? '[]');
    if (!Array.isArray(savedFavorites)) {
      throw new TypeError('Saved favorites must be a list.');
    }

    const favorites = new Set(savedFavorites.filter(
      (roomName) => typeof roomName === 'string' && favoriteRoomNames.has(roomName),
    ));
    favoriteButtons.forEach((button) => {
      setFavoriteState(button, favorites.has(button.dataset.favoriteRoom));
    });

    favoriteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const roomName = button.dataset.favoriteRoom;
        const shouldFavorite = !favorites.has(roomName);
        if (shouldFavorite) {
          favorites.add(roomName);
        } else {
          favorites.delete(roomName);
        }

        try {
          localStorage.setItem('favoriteRooms', JSON.stringify([...favorites]));
          setFavoriteState(button, shouldFavorite);
          if (featuredRoomsStatus) {
            featuredRoomsStatus.textContent = '';
          }
        } catch (error) {
          if (shouldFavorite) {
            favorites.delete(roomName);
          } else {
            favorites.add(roomName);
          }
          if (featuredRoomsStatus) {
            featuredRoomsStatus.textContent = 'Your favorite could not be saved. Check your browser storage settings and try again.';
          }
        }

      });
    });
  } catch (error) {
    if (featuredRoomsStatus) {
      featuredRoomsStatus.textContent = 'Saved favorites could not be loaded. You can still browse and book rooms.';
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = targetId && targetId.length > 1
        ? document.getElementById(decodeURIComponent(targetId.slice(1)))
        : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', targetId);
    });
  });

  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    const updateBackToTopVisibility = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    };

    backToTop.addEventListener('click', () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
    updateBackToTopVisibility();
  }

  featuredRoomsGrid.querySelectorAll('[data-book-room]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const roomName = link.dataset.roomName;
      const roomPrice = Number(link.dataset.roomPrice);
      if (!roomName || !Number.isFinite(roomPrice)) {
        event.preventDefault();
        if (featuredRoomsStatus) {
          featuredRoomsStatus.textContent = 'This room could not be selected. Please try again later.';
        }
        return;
      }

      try {
        localStorage.setItem('selectedHotelRoom', JSON.stringify({ name: roomName, price: roomPrice }));
      } catch (error) {
        event.preventDefault();
        if (featuredRoomsStatus) {
          featuredRoomsStatus.textContent = 'Your room selection could not be saved. Check your browser storage settings and try again.';
        }
      }
    });
  });

  const roomCards = featuredRoomsGrid.querySelectorAll('[data-room-card]');
  const canAnimateCards = 'IntersectionObserver' in window
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canAnimateCards) {
    const roomCardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    roomCards.forEach((card) => {
      card.classList.add('room-card--animate');
      roomCardObserver.observe(card);
    });
  }
}