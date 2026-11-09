const roomTypeOptions = [
  'Single Room',
  'Deluxe Suite',
  'Presidential Suite',
  'Ocean View Room',
  'Family Room',
];
const roomStatuses = ['Available', 'Occupied', 'Cleaning'];
const hotelDataVersion = '4';
const roomVersionStorageKey = 'hotelDataVersion';
const roomImages = {
  'Deluxe Suite': ['public/room1.jpg', 'public/room2.jpg', 'public/room3.jpg'],
  'Presidential Suite': ['public/room4.jpg', 'public/room5.jpg'],
  'Ocean View Room': ['public/room6.jpg', 'public/room7.jpg'],
  'Family Room': ['public/room8.jpg'],
  'Single Room': ['public/room9.jpg'],
};

const initialRooms = [
  {
    id: 'R101',
    name: 'Deluxe Garden Suite',
    type: 'Deluxe Suite',
    price: 250,
    beds: 2,
    baths: 2,
    size: 450,
    maxGuests: 3,
    status: 'Available',
    images: roomImages['Deluxe Suite'],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85',
    description: 'A serene suite with a king bed, elegant sitting area, and calming garden views.',
  },
  {
    id: 'R102',
    name: 'Deluxe City Suite',
    type: 'Deluxe Suite',
    price: 320,
    beds: 2,
    baths: 2,
    size: 510,
    maxGuests: 4,
    status: 'Available',
    images: roomImages['Deluxe Suite'],
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
    description: 'Contemporary comfort with a separate lounge and sweeping city views.',
  },
  {
    id: 'R103',
    name: 'Grand Presidential Suite',
    type: 'Presidential Suite',
    price: 900,
    beds: 3,
    baths: 4,
    size: 1200,
    maxGuests: 6,
    status: 'Occupied',
    images: roomImages['Presidential Suite'],
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    description: 'Our grandest residence, with expansive living and dining spaces for special stays.',
  },
  {
    id: 'R104',
    name: 'Royal Presidential Suite',
    type: 'Presidential Suite',
    price: 1000,
    beds: 3,
    baths: 3,
    size: 1050,
    maxGuests: 6,
    status: 'Available',
    images: roomImages['Presidential Suite'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
    description: 'A private, light-filled retreat featuring premium finishes and a private balcony.',
  },
  {
    id: 'R105',
    name: 'Ocean View Retreat',
    type: 'Ocean View Room',
    price: 320,
    beds: 1,
    baths: 1,
    size: 380,
    maxGuests: 2,
    status: 'Cleaning',
    images: roomImages['Ocean View Room'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85',
    description: 'Wake to beautiful ocean views from this tranquil room with a private terrace.',
  },
  {
    id: 'R106',
    name: 'Oceanfront Deluxe Room',
    type: 'Ocean View Room',
    price: 480,
    beds: 2,
    baths: 1,
    size: 430,
    maxGuests: 3,
    status: 'Available',
    images: roomImages['Ocean View Room'],
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=85',
    description: 'A spacious coastal escape with a front-row view of the water and sunset.',
  },
  {
    id: 'R107',
    name: 'Family Garden Residence',
    type: 'Family Room',
    price: 420,
    beds: 3,
    baths: 2,
    size: 720,
    maxGuests: 6,
    status: 'Available',
    images: roomImages['Family Room'],
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
    description: 'Room for everyone, with flexible sleeping arrangements and a relaxed lounge.',
  },
  {
    id: 'R108',
    name: 'Classic Single Room',
    type: 'Single Room',
    price: 120,
    beds: 1,
    baths: 1,
    size: 240,
    maxGuests: 1,
    status: 'Available',
    images: roomImages['Single Room'],
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85',
    description: 'A thoughtfully appointed private room, ideal for a comfortable city stay.',
  },
  {
    id: 'R109',
    name: 'Single Courtyard Room',
    type: 'Single Room',
    price: 160,
    beds: 1,
    baths: 1,
    size: 280,
    maxGuests: 1,
    status: 'Occupied',
    images: roomImages['Single Room'],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85',
    description: 'A peaceful courtyard-facing room with everything needed for a restful stay.',
  },
];

const roomFilters = document.querySelector('#room-filters');
const roomGrid = document.querySelector('#rooms-grid');
const resultCount = document.querySelector('#rooms-results-count');
const resultsError = document.querySelector('#rooms-results-error');
const emptyState = document.querySelector('#rooms-empty');
const maxPriceInput = document.querySelector('#filter-max-price');
const maxPriceValue = document.querySelector('#filter-max-price-value');
const resetEmptyFilters = document.querySelector('#reset-empty-filters');
const bookingStorageKey = 'hotelBookingSearch';
const roomStorageKey = 'hotelRooms';
const favoriteStorageKey = 'favoriteRooms';
const typeFilter = document.querySelector('#filter-room-type');
const guestFilter = document.querySelector('#filter-guests');
const sortFilter = document.querySelector('#filter-sort');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const validateRooms = (rooms) => {
  if (!Array.isArray(rooms)) {
    throw new TypeError('The saved room catalog must be a list.');
  }

  const ids = new Set();
  return rooms.map((room, index) => {
    if (!room || typeof room !== 'object') {
      throw new TypeError(`Room ${index + 1} is not a valid room record.`);
    }

    const isValid = typeof room.id === 'string'
      && room.id.length > 0
      && !ids.has(room.id)
      && typeof room.name === 'string'
      && room.name.length > 0
      && roomTypeOptions.includes(room.type)
      && Number.isFinite(Number(room.price))
      && Number(room.price) >= 0
      && Number.isInteger(Number(room.beds))
      && Number(room.beds) > 0
      && Number.isInteger(Number(room.baths))
      && Number(room.baths) > 0
      && Number.isFinite(Number(room.size))
      && Number(room.size) > 0
      && Number.isInteger(Number(room.maxGuests))
      && Number(room.maxGuests) > 0
      && roomStatuses.includes(room.status)
      && (typeof room.image === 'string' || Array.isArray(room.images))
      && typeof room.description === 'string';

    if (!isValid) {
      throw new TypeError(`Room ${index + 1} has invalid or incomplete data.`);
    }
    ids.add(room.id);
    const images = Array.isArray(room.images)
      ? room.images.filter((image) => typeof image === 'string' && image.trim())
      : (typeof room.image === 'string' && room.image.trim() ? [room.image] : []);
    if (images.length === 0) {
      throw new TypeError(`Room ${index + 1} must have at least one image.`);
    }

    return {
      ...room,
      images,
      image: typeof room.image === 'string' && room.image.trim() ? room.image : images[0],
      price: Number(room.price),
      beds: Number(room.beds),
      baths: Number(room.baths),
      size: Number(room.size),
      maxGuests: Number(room.maxGuests),
    };
  });
};

const loadRooms = () => {
  const savedRooms = localStorage.getItem(roomStorageKey);
  const savedVersion = localStorage.getItem(roomVersionStorageKey);
  if (savedRooms === null || savedVersion !== hotelDataVersion) {
    const rooms = validateRooms(initialRooms);
    localStorage.setItem(roomStorageKey, JSON.stringify(rooms));
    localStorage.setItem(roomVersionStorageKey, hotelDataVersion);
    return rooms;
  }

  const parsedRooms = JSON.parse(savedRooms);
  const rooms = validateRooms(parsedRooms);
  if (rooms.some((room, index) => !Array.isArray(parsedRooms[index]?.images))) {
    localStorage.setItem(roomStorageKey, JSON.stringify(rooms));
  }
  return rooms;
};

window.loadHotelRooms = loadRooms;
window.saveHotelRooms = (rooms) => {
  const validRooms = validateRooms(rooms);
  localStorage.setItem(roomStorageKey, JSON.stringify(validRooms));
  localStorage.setItem(roomVersionStorageKey, hotelDataVersion);
  return validRooms;
};

const formatPrice = (price) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(price);

const safeImageUrl = (image) => {
  try {
    const parsedUrl = new URL(image, window.location.href);
    const isRelativePath = !/^[a-z][a-z\d+.-]*:/i.test(image) && !image.startsWith('//');
    return parsedUrl.protocol === 'https:'
      || (isRelativePath && parsedUrl.origin === window.location.origin)
      ? parsedUrl.href
      : '';
  } catch {
    return '';
  }
};

const showError = (message) => {
  resultsError.textContent = message;
  resultsError.hidden = !message;
};

const makeRoomCard = (room) => {
  const statusClass = room.status.toLowerCase();
  const isAvailable = room.status === 'Available';
  const images = room.images.map(safeImageUrl).filter(Boolean);
  const image = images[0] ?? '';
  const favorite = favorites.has(room.name);
  const wrapper = document.createElement('div');
  wrapper.className = 'rooms-grid__item';
  wrapper.innerHTML = `
    <article class="card room-card" data-room-card>
      <div class="room-card__image-wrap">
        <img
          class="room-card__image"
          src="${escapeHtml(image)}"
          data-fallback-src="${escapeHtml(safeImageUrl(room.image))}"
          alt="${escapeHtml(room.name)}"
          loading="lazy">
        <span class="room-card__tag room-card__tag--${escapeHtml(statusClass)}">${escapeHtml(room.status)}</span>
        <button class="room-card__photo-count" type="button" data-open-gallery data-gallery-title="${escapeHtml(room.name)}" data-gallery-fallback="${escapeHtml(safeImageUrl(room.image))}" data-gallery-images="${escapeHtml(JSON.stringify(images))}" aria-label="View ${images.length} photos of ${escapeHtml(room.name)}">
          <i class="fa-solid fa-camera" aria-hidden="true"></i> ${images.length}
        </button>
        <button
          class="room-card__favorite${favorite ? ' is-favorite' : ''}"
          type="button"
          aria-label="${favorite ? 'Remove' : 'Add'} ${escapeHtml(room.name)} ${favorite ? 'from' : 'to'} favorites"
          aria-pressed="${favorite}"
          data-room-favorite="${escapeHtml(room.name)}">
          <i class="${favorite ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>
        </button>
      </div>
      <div class="room-card__body">
        <h2 class="room-card__name">${escapeHtml(room.name)}</h2>
        <ul class="room-card__features room-card__features--rooms" aria-label="Room features">
          <li><i class="fa-solid fa-bed" aria-hidden="true"></i> ${room.beds} ${room.beds === 1 ? 'Bed' : 'Beds'}</li>
          <li><i class="fa-solid fa-bath" aria-hidden="true"></i> ${room.baths} ${room.baths === 1 ? 'Bath' : 'Baths'}</li>
          <li><i class="fa-solid fa-ruler-combined" aria-hidden="true"></i> ${new Intl.NumberFormat('en-US').format(room.size)} Sq Ft</li>
          <li><i class="fa-solid fa-user-group" aria-hidden="true"></i> Up to ${room.maxGuests}</li>
        </ul>
        <p class="room-card__description">${escapeHtml(room.description)}</p>
        <div class="room-card__footer">
          <p class="room-card__price"><span>${formatPrice(room.price)}</span> / night</p>
          <button
            class="btn btn-accent room-card__book"
            type="button"
            data-book-room
            data-room-id="${escapeHtml(room.id)}"
            data-room-name="${escapeHtml(room.name)}"
            data-room-price="${room.price}"
            ${isAvailable ? '' : 'disabled'}>
            ${isAvailable ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
    </article>
  `;
  return wrapper;
};

const updateFavoritesFromStorage = () => {
  const storedFavorites = localStorage.getItem(favoriteStorageKey);
  if (storedFavorites === null) {
    return new Set();
  }
  const parsedFavorites = JSON.parse(storedFavorites);
  if (!Array.isArray(parsedFavorites) || parsedFavorites.some((item) => typeof item !== 'string')) {
    throw new TypeError('Saved favorite rooms are not in the expected format.');
  }
  return new Set(parsedFavorites);
};

const readHomeSearch = () => {
  const savedSearch = localStorage.getItem(bookingStorageKey);
  if (!savedSearch) {
    return;
  }

  const search = JSON.parse(savedSearch);
  if (!search || typeof search !== 'object') {
    throw new TypeError('Saved room search is not in the expected format.');
  }

  const searchTypes = {
    'single-room': 'Single Room',
    'deluxe-suite': 'Deluxe Suite',
    'presidential-suite': 'Presidential Suite',
    'ocean-view-room': 'Ocean View Room',
    'family-room': 'Family Room',
  };
  const selectedType = searchTypes[String(search.roomType).toLowerCase()] ?? search.roomType;
  if (roomTypeOptions.includes(selectedType)) {
    typeFilter.value = selectedType;
  }

  const selectedGuests = String(search.guests ?? '');
  if (/^[1-6]$/.test(selectedGuests)) {
    guestFilter.value = selectedGuests;
  }
};

let rooms = [];
let favorites = new Set();

if (roomFilters && roomGrid && resultCount && resultsError && emptyState && maxPriceInput && maxPriceValue) {
  try {
    rooms = loadRooms();
  } catch (error) {
    showError('We could not load the saved room catalog. Please check the saved room data and try again.');
  }

  try {
    favorites = updateFavoritesFromStorage();
  } catch (error) {
    showError('Saved favorites could not be loaded. You can still browse rooms.');
  }

  try {
    readHomeSearch();
  } catch (error) {
    showError('Your saved search could not be loaded. You can still filter rooms below.');
  }

  const updateMaxPriceLabel = () => {
    maxPriceValue.textContent = formatPrice(Number(maxPriceInput.value));
  };

  const applyFilters = () => {
    const requestedType = typeFilter.value;
    const requestedGuests = guestFilter.value === 'any' ? 0 : Number(guestFilter.value);
    const maximumPrice = Number(maxPriceInput.value);
    const sortOrder = sortFilter.value;

    let matchingRooms = rooms.filter((room) => (
      (requestedType === 'all' || room.type === requestedType)
      && room.price <= maximumPrice
      && room.maxGuests >= requestedGuests
    ));

    if (sortOrder === 'price-low') {
      matchingRooms = [...matchingRooms].sort((first, second) => first.price - second.price);
    } else if (sortOrder === 'price-high') {
      matchingRooms = [...matchingRooms].sort((first, second) => second.price - first.price);
    }

    roomGrid.replaceChildren(...matchingRooms.map(makeRoomCard));
    resultCount.textContent = `Showing ${matchingRooms.length} ${matchingRooms.length === 1 ? 'room' : 'rooms'}`;
    emptyState.hidden = matchingRooms.length > 0 || rooms.length === 0;
    showError(resultsError.textContent);

    roomGrid.querySelectorAll('[data-room-favorite]').forEach((button) => {
      button.addEventListener('click', () => {
        const roomName = button.dataset.roomFavorite;
        const shouldFavorite = !favorites.has(roomName);
        const nextFavorites = new Set(favorites);
        if (shouldFavorite) {
          nextFavorites.add(roomName);
        } else {
          nextFavorites.delete(roomName);
        }

        try {
          localStorage.setItem(favoriteStorageKey, JSON.stringify([...nextFavorites]));
          favorites = nextFavorites;
          button.classList.toggle('is-favorite', shouldFavorite);
          button.setAttribute('aria-pressed', String(shouldFavorite));
          button.setAttribute('aria-label', `${shouldFavorite ? 'Remove' : 'Add'} ${roomName} ${shouldFavorite ? 'from' : 'to'} favorites`);
          const icon = button.querySelector('i');
          icon.classList.toggle('fa-solid', shouldFavorite);
          icon.classList.toggle('fa-regular', !shouldFavorite);
          showError('');
        } catch (error) {
          showError('Your favorite could not be saved. Check your browser storage settings and try again.');
        }
      });
    });

    roomGrid.querySelectorAll('[data-book-room]').forEach((button) => {
      button.addEventListener('click', () => {
        const selection = {
          id: button.dataset.roomId,
          name: button.dataset.roomName,
          price: Number(button.dataset.roomPrice),
        };
        try {
          localStorage.setItem('selectedHotelRoom', JSON.stringify(selection));
          window.location.href = 'booking.html';
        } catch (error) {
          showError('Your room selection could not be saved. Check your browser storage settings and try again.');
        }
      });
    });

    const cards = roomGrid.querySelectorAll('[data-room-card]');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      cards.forEach((card, index) => {
        card.classList.add('room-card--animate');
        card.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
        cardObserver.observe(card);
      });
    }
  };

  updateMaxPriceLabel();
  applyFilters();

  roomFilters.addEventListener('input', (event) => {
    if (event.target === maxPriceInput) {
      updateMaxPriceLabel();
    }
    applyFilters();
  });

  roomFilters.addEventListener('change', applyFilters);
  roomFilters.addEventListener('reset', () => {
    window.setTimeout(() => {
      updateMaxPriceLabel();
      applyFilters();
    });
  });

  resetEmptyFilters.addEventListener('click', () => roomFilters.reset());
}