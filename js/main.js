const EMAILJS_PUBLIC_KEY = "PASTE_HERE";
const EMAILJS_SERVICE_ID = "PASTE_HERE";
const EMAILJS_TEMPLATE_ID = "PASTE_HERE";

const roomImageFallback = 'public/room-placeholder.svg';

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied === 'placeholder') {
    return;
  }

  const fallback = image.dataset.fallbackSrc;
  if (fallback && image.dataset.fallbackApplied !== 'remote' && image.src !== fallback) {
    image.dataset.fallbackApplied = 'remote';
    image.src = fallback;
    return;
  }
  image.dataset.fallbackApplied = 'placeholder';
  image.src = roomImageFallback;
}, true);

const makeGalleryUrl = (value) => {
  try {
    const url = new URL(value, window.location.href);
    const isRelativePath = !/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith('//');
    return url.protocol === 'https:'
      || (isRelativePath && url.origin === window.location.origin)
      ? url.href
      : '';
  } catch {
    return '';
  }
};

const galleryDialog = document.createElement('dialog');
galleryDialog.className = 'room-gallery';
galleryDialog.setAttribute('aria-label', 'Room photo gallery');
galleryDialog.innerHTML = `
  <div class="room-gallery__panel">
    <button class="room-gallery__close" type="button" aria-label="Close photo gallery">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
    <h2 class="room-gallery__title"></h2>
    <div class="room-gallery__stage">
      <button class="room-gallery__arrow room-gallery__arrow--previous" type="button" aria-label="Previous photo">
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
      </button>
      <img class="room-gallery__image" alt="">
      <button class="room-gallery__arrow room-gallery__arrow--next" type="button" aria-label="Next photo">
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
    <p class="room-gallery__counter" aria-live="polite"></p>
    <div class="room-gallery__thumbnails" aria-label="Choose a photo"></div>
  </div>
`;
document.body.append(galleryDialog);

const galleryImage = galleryDialog.querySelector('.room-gallery__image');
const galleryCounter = galleryDialog.querySelector('.room-gallery__counter');
const galleryThumbnails = galleryDialog.querySelector('.room-gallery__thumbnails');
let galleryImages = [];
let galleryTitle = '';
let galleryFallback = '';
let galleryIndex = 0;
let galleryTouchStartX = 0;

const showGalleryImage = (index) => {
  if (!galleryImages.length) {
    return;
  }

  galleryIndex = (index + galleryImages.length) % galleryImages.length;
  galleryImage.classList.add('is-changing');
  window.setTimeout(() => {
    delete galleryImage.dataset.fallbackApplied;
    galleryImage.dataset.fallbackSrc = galleryFallback;
    galleryImage.src = galleryImages[galleryIndex];
    galleryImage.alt = `${galleryTitle}, photo ${galleryIndex + 1}`;
    galleryImage.classList.remove('is-changing');
  }, 100);
  galleryCounter.textContent = `Image ${galleryIndex + 1} of ${galleryImages.length}`;
  galleryThumbnails.querySelectorAll('[data-gallery-index]').forEach((thumbnail, thumbnailIndex) => {
    const isActive = thumbnailIndex === galleryIndex;
    thumbnail.classList.toggle('is-active', isActive);
    thumbnail.setAttribute('aria-current', String(isActive));
  });
};

const openGallery = (trigger) => {
  let images;
  try {
    images = JSON.parse(trigger.dataset.galleryImages ?? '[]');
  } catch (error) {
    return;
  }

  galleryImages = Array.isArray(images) ? images.map(makeGalleryUrl).filter(Boolean) : [];
  galleryTitle = trigger.dataset.galleryTitle ?? 'Room photos';
  galleryFallback = makeGalleryUrl(trigger.dataset.galleryFallback ?? '');
  if (!galleryImages.length) {
    return;
  }

  galleryDialog.querySelector('.room-gallery__title').textContent = galleryTitle;
  galleryThumbnails.replaceChildren(...galleryImages.map((src, index) => {
    const thumbnail = document.createElement('button');
    thumbnail.className = 'room-gallery__thumbnail';
    thumbnail.type = 'button';
    thumbnail.dataset.galleryIndex = String(index);
    thumbnail.setAttribute('aria-label', `Show photo ${index + 1}`);
    const image = document.createElement('img');
    image.src = src;
    image.dataset.fallbackSrc = makeGalleryUrl(trigger.dataset.galleryFallback ?? '');
    image.alt = `${galleryTitle}, thumbnail ${index + 1}`;
    image.loading = 'lazy';
    thumbnail.append(image);
    thumbnail.addEventListener('click', () => showGalleryImage(index));
    return thumbnail;
  }));
  showGalleryImage(0);
  if (!galleryDialog.open) {
    galleryDialog.showModal();
  }
};

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const trigger = event.target.closest('[data-open-gallery]');
  if (trigger instanceof HTMLButtonElement) {
    openGallery(trigger);
  }
});

galleryDialog.querySelector('.room-gallery__close').addEventListener('click', () => galleryDialog.close());
galleryDialog.querySelector('.room-gallery__arrow--previous').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
galleryDialog.querySelector('.room-gallery__arrow--next').addEventListener('click', () => showGalleryImage(galleryIndex + 1));
galleryDialog.addEventListener('click', (event) => {
  if (event.target === galleryDialog) {
    galleryDialog.close();
  }
});
galleryDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showGalleryImage(galleryIndex - 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    showGalleryImage(galleryIndex + 1);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    galleryDialog.close();
  }
});
galleryImage.addEventListener('touchstart', (event) => {
  galleryTouchStartX = event.changedTouches[0].clientX;
}, { passive: true });
galleryImage.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - galleryTouchStartX;
  if (Math.abs(distance) > 40) {
    showGalleryImage(galleryIndex + (distance < 0 ? 1 : -1));
  }
}, { passive: true });

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
  if (typeof window.loadHotelRooms === 'function') {
    try {
      const roomCatalog = window.loadHotelRooms();
      const featuredRooms = roomCatalog
        .filter((room) => room.status === 'Available')
        .sort((first, second) => second.price - first.price)
        .slice(0, 3);
      featuredRoomsGrid.querySelectorAll('[data-room-card]').forEach((card, index) => {
        const room = featuredRooms[index];
        if (!room) {
          card.hidden = true;
          return;
        }

        card.hidden = false;
        const image = card.querySelector('.room-card__image');
        const galleryButton = card.querySelector('[data-open-gallery]');
        const favoriteButton = card.querySelector('[data-favorite-room]');
        const bookLink = card.querySelector('[data-book-room]');
        const name = room.name;
        image.src = makeGalleryUrl(room.images[0]) || roomImageFallback;
        image.dataset.fallbackSrc = makeGalleryUrl(room.image);
        image.alt = `${name} room cover photo`;
        delete image.dataset.fallbackApplied;
        galleryButton.dataset.galleryTitle = name;
        galleryButton.dataset.galleryFallback = makeGalleryUrl(room.image);
        galleryButton.dataset.galleryImages = JSON.stringify(room.images);
        galleryButton.setAttribute('aria-label', `View ${room.images.length} photos of ${name}`);
        galleryButton.innerHTML = `<i class="fa-solid fa-camera" aria-hidden="true"></i> ${room.images.length}`;
        favoriteButton.dataset.favoriteRoom = name;
        favoriteButton.setAttribute('aria-label', `Add ${name} to favorites`);
        favoriteButton.setAttribute('aria-pressed', 'false');
        favoriteButton.classList.remove('is-favorite');
        favoriteButton.querySelector('i').className = 'fa-regular fa-heart';
        card.querySelector('.room-card__tag').textContent = room.type;
        card.querySelector('.room-card__name').textContent = name;
        card.querySelector('.room-card__features').innerHTML = `
          <li><i class="fa-solid fa-bed" aria-hidden="true"></i> ${room.beds} ${room.beds === 1 ? 'Bed' : 'Beds'}</li>
          <li><i class="fa-solid fa-bath" aria-hidden="true"></i> ${room.baths} ${room.baths === 1 ? 'Bath' : 'Baths'}</li>
          <li><i class="fa-solid fa-ruler-combined" aria-hidden="true"></i> ${new Intl.NumberFormat('en-US').format(room.size)} Sq Ft</li>
        `;
        card.querySelector('.room-card__price span').textContent = `$${new Intl.NumberFormat('en-US').format(room.price)}`;
        bookLink.dataset.roomId = room.id;
        bookLink.dataset.roomName = name;
        bookLink.dataset.roomPrice = String(room.price);
      });
    } catch (error) {
      if (featuredRoomsStatus) {
        featuredRoomsStatus.textContent = 'Room photos could not be loaded from the saved room catalog.';
      }
    }
  }

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

  featuredRoomsGrid.querySelectorAll('[data-book-room]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const roomName = link.dataset.roomName;
      const roomPrice = Number(link.dataset.roomPrice);
      const roomId = link.dataset.roomId;
      if (!roomName || !roomId || !Number.isFinite(roomPrice)) {
        event.preventDefault();
        if (featuredRoomsStatus) {
          featuredRoomsStatus.textContent = 'This room could not be selected. Please try again later.';
        }
        return;
      }

      try {
        localStorage.setItem('selectedHotelRoom', JSON.stringify({ id: roomId, name: roomName, price: roomPrice }));
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

const contactForm = document.querySelector('#contact-form');

if (contactForm instanceof HTMLFormElement) {
  const contactFields = [
    contactForm.elements.namedItem('name'),
    contactForm.elements.namedItem('email'),
    contactForm.elements.namedItem('subject'),
    contactForm.elements.namedItem('message'),
  ];
  const contactStatus = document.querySelector('#contact-form-status');

  const validateContactField = (field) => {
    const error = document.querySelector(`#${field.id}-error`);
    const value = field.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      message = 'Enter a valid email address.';
    }

    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) {
      error.textContent = message;
    }
    return !message;
  };

  contactFields.forEach((field) => {
    field.addEventListener('blur', () => validateContactField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateContactField(field);
      }
    });
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const isValid = contactFields.map(validateContactField).every(Boolean);
    if (!isValid) {
      contactForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const message = {
      name: contactFields[0].value.trim(),
      email: contactFields[1].value.trim(),
      subject: contactFields[2].value.trim(),
      message: contactFields[3].value.trim(),
      date: new Date().toISOString(),
    };

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonContent = submitButton.innerHTML;
    contactStatus.textContent = '';
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';

    try {
      if (
        EMAILJS_PUBLIC_KEY === 'PASTE_HERE'
        || EMAILJS_SERVICE_ID === 'PASTE_HERE'
        || EMAILJS_TEMPLATE_ID === 'PASTE_HERE'
      ) {
        throw new Error('Configure the EmailJS public key, service ID, and template ID in js/main.js.');
      }

      if (!window.emailjs) {
        throw new Error('EmailJS did not load.');
      }

      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        message,
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
    } catch {
      contactStatus.textContent = 'Your message could not be sent. Please try again.';
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      submitButton.innerHTML = originalButtonContent;
      return;
    }

    try {
      const savedMessages = localStorage.getItem('hotelMessages');
      const messages = savedMessages ? JSON.parse(savedMessages) : [];
      if (!Array.isArray(messages)) {
        throw new TypeError('Saved messages must be a list.');
      }
      localStorage.setItem('hotelMessages', JSON.stringify([...messages, message]));
    } catch {
      contactStatus.textContent = 'Your message was sent, but could not be saved in this browser. Please check your browser storage settings.';
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      submitButton.innerHTML = originalButtonContent;
      return;
    }

    contactForm.innerHTML = `
      <div class="contact-thank-you" role="status">
        <span><i class="fa-solid fa-check" aria-hidden="true"></i></span>
        <h3>Thank you for reaching out!</h3>
        <p>Your message has been received. Our team will be in touch soon.</p>
      </div>
    `;
  });
}