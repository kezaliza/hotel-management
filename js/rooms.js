const roomTypeOptions = [
  'Single Room',
  'Deluxe Suite',
  'Presidential Suite',
  'Ocean View Room',
  'Family Room',
];
const roomStatuses = ['Available', 'Occupied', 'Cleaning'];
const hotelDataVersion = '6';
const roomVersionStorageKey = 'hotelDataVersion';

const initialRooms = [
  {
    id: 'R101',
    name: 'Deluxe Garden Suite',
    type: 'Deluxe Suite',
    price: 250,
    beds: 1,
    baths: 1,
    size: 450,
    maxGuests: 2,
    status: 'Available',
    images: ['public/room1.jpg'],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85',
    description: 'An airy king room with a padded headboard, warm orange accents, and a nearby lounge chair.',
  },
  {
    id: 'R102',
    name: 'Deluxe City Suite',
    type: 'Deluxe Suite',
    price: 320,
    beds: 1,
    baths: 1,
    size: 470,
    maxGuests: 2,
    status: 'Available',
    images: ['public/room2.jpg'],
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85',
    description: 'A dark, softly lit king room with a tufted headboard, layered bedding, and bedside lighting.',
  },
  {
    id: 'R103',
    name: 'Grand Presidential Suite',
    type: 'Presidential Suite',
    price: 900,
    beds: 1,
    baths: 1,
    size: 800,
    maxGuests: 2,
    status: 'Occupied',
    images: ['public/room4.jpg'],
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    description: 'A dramatic king room beneath a dark canopy, accented by a chandelier and warm bedside lighting.',
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
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85'],
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
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85'],
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
    images: ['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=85'],
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=85',
    description: 'A spacious coastal escape with a front-row view of the water and sunset.',
  },
  {
    id: 'R107',
    name: 'Family Garden Residence',
    type: 'Family Room',
    price: 420,
    beds: 3,
    baths: 1,
    size: 720,
    maxGuests: 6,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85'],
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
    images: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85'],
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
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85'],
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85',
    description: 'A peaceful courtyard-facing room with everything needed for a restful stay.',
  },
  {
    id: 'R110',
    name: 'Fur-Trimmed King Suite',
    type: 'Deluxe Suite',
    price: 430,
    beds: 1,
    baths: 1,
    size: 500,
    maxGuests: 2,
    status: 'Available',
    images: ['public/0548d1e87da41b28bc934fcfb7187501.jpg'],
    image: 'public/0548d1e87da41b28bc934fcfb7187501.jpg',
    description: 'A neutral king bedroom with a padded headboard, layered textured throws, bedside lamps, and an upholstered bench.',
  },
  {
    id: 'R111',
    name: 'Rustic Timber Suite',
    type: 'Deluxe Suite',
    price: 360,
    beds: 1,
    baths: 1,
    size: 470,
    maxGuests: 2,
    status: 'Available',
    images: ['public/058165175c7193d5d11d0b93b88f13f8.jpg'],
    image: 'public/058165175c7193d5d11d0b93b88f13f8.jpg',
    description: 'A king bedroom with a timber feature wall, pendant lights, and a large window beside the bed.',
  },
  {
    id: 'R112',
    name: 'Midnight Lounge Suite',
    type: 'Presidential Suite',
    price: 680,
    beds: 1,
    baths: 1,
    size: 620,
    maxGuests: 2,
    status: 'Available',
    images: ['public/09fc390962418e5f0fb79be5842d8db0.jpg'],
    image: 'public/09fc390962418e5f0fb79be5842d8db0.jpg',
    description: 'A dramatic dark-toned king room with a tufted headboard, bedside lighting, and a round upholstered lounge seat.',
  },
  {
    id: 'R113',
    name: 'Stonewall Retreat',
    type: 'Deluxe Suite',
    price: 390,
    beds: 1,
    baths: 1,
    size: 500,
    maxGuests: 2,
    status: 'Available',
    images: ['public/1836769b33a0856683da72731ec2516e.jpg'],
    image: 'public/1836769b33a0856683da72731ec2516e.jpg',
    description: 'A charcoal king bedroom with a textured stone accent wall, layered dark bedding, and a tall window beside the bed.',
  },
  {
    id: 'R114',
    name: 'Golden Glow Suite',
    type: 'Deluxe Suite',
    price: 410,
    beds: 1,
    baths: 1,
    size: 520,
    maxGuests: 2,
    status: 'Available',
    images: ['public/1f8a6e159f1b3b6cc236fb631b59d232.jpg'],
    image: 'public/1f8a6e159f1b3b6cc236fb631b59d232.jpg',
    description: 'A richly decorated king bedroom with a chandelier, vanity mirror, television, and gold-toned accents.',
  },
  {
    id: 'R115',
    name: 'City Lights Balcony Room',
    type: 'Deluxe Suite',
    price: 430,
    beds: 1,
    baths: 1,
    size: 480,
    maxGuests: 2,
    status: 'Available',
    images: ['public/339fa300ee480cc445c9fdaf6ffffabc.jpg'],
    image: 'public/339fa300ee480cc445c9fdaf6ffffabc.jpg',
    description: 'A king room opening to a flower-framed balcony with a hanging chair and city lights beyond.',
  },
  {
    id: 'R116',
    name: 'Soft Neutral King Room',
    type: 'Deluxe Suite',
    price: 310,
    beds: 1,
    baths: 1,
    size: 430,
    maxGuests: 2,
    status: 'Available',
    images: ['public/3b6dc088bffd6cef3b8ad340a896e7f0.jpg'],
    image: 'public/3b6dc088bffd6cef3b8ad340a896e7f0.jpg',
    description: 'A single bed with a softly tufted headboard, layered neutral bedding, and a matching upholstered footstool.',
  },
  {
    id: 'R117',
    name: 'Garden Twin Alcove',
    type: 'Family Room',
    price: 340,
    beds: 2,
    baths: 1,
    size: 540,
    maxGuests: 4,
    status: 'Available',
    images: ['public/40587c78e4587ca46f4c1ebac45afed3.jpg'],
    image: 'public/40587c78e4587ca46f4c1ebac45afed3.jpg',
    description: 'Two curtained sleeping alcoves share a plant-filled room with warm string lighting and a patterned rug.',
  },
  {
    id: 'R118',
    name: 'Copper Mirror Suite',
    type: 'Deluxe Suite',
    price: 450,
    beds: 1,
    baths: 1,
    size: 530,
    maxGuests: 2,
    status: 'Available',
    images: ['public/44a11d158ba1574e46e96fc529108665.jpg'],
    image: 'public/44a11d158ba1574e46e96fc529108665.jpg',
    description: 'A king bedroom with a full-height mirrored wall, copper-colored bedding, and warm pendant lighting.',
  },
  {
    id: 'R119',
    name: 'Snowfall Chandelier Suite',
    type: 'Presidential Suite',
    price: 760,
    beds: 1,
    baths: 1,
    size: 760,
    maxGuests: 2,
    status: 'Available',
    images: ['public/48426f9b6a71a3e5a74bcecb00b92556.jpg'],
    image: 'public/48426f9b6a71a3e5a74bcecb00b92556.jpg',
    description: 'A plush king bed beneath a crystal chandelier, with a large window overlooking snowy trees.',
  },
  {
    id: 'R120',
    name: 'Golden Bedchamber',
    type: 'Deluxe Suite',
    price: 400,
    beds: 1,
    baths: 1,
    size: 510,
    maxGuests: 2,
    status: 'Available',
    images: ['public/6bccc7e22e0eb2ea16578d2c57f3219b.jpg'],
    image: 'public/6bccc7e22e0eb2ea16578d2c57f3219b.jpg',
    description: 'A canopied king bed in a warmly lit room with plants, framed artwork, and a cushioned bench.',
  },
  {
    id: 'R121',
    name: 'Natural Stone King Room',
    type: 'Deluxe Suite',
    price: 350,
    beds: 1,
    baths: 1,
    size: 460,
    maxGuests: 2,
    status: 'Available',
    images: ['public/6dba5feb6ce624f3ded9a0444c380a67.jpg'],
    image: 'public/6dba5feb6ce624f3ded9a0444c380a67.jpg',
    description: 'A king bedroom featuring textured stone walls, woven pendant lights, and natural wood finishes.',
  },
  {
    id: 'R122',
    name: 'Velvet Canopy Hideaway',
    type: 'Presidential Suite',
    price: 650,
    beds: 1,
    baths: 1,
    size: 600,
    maxGuests: 2,
    status: 'Available',
    images: ['public/71610925bf1ae8637d65ce4e663d3c09.jpg'],
    image: 'public/71610925bf1ae8637d65ce4e663d3c09.jpg',
    description: 'A king bed framed by deep red drapes, with an ornate mirror and patterned floor covering.',
  },
  {
    id: 'R123',
    name: 'Sage Garden Twin Room',
    type: 'Family Room',
    price: 330,
    beds: 2,
    baths: 1,
    size: 560,
    maxGuests: 4,
    status: 'Available',
    images: ['public/7482ddbca18098a7e34a10b7d72184e7.jpg'],
    image: 'public/7482ddbca18098a7e34a10b7d72184e7.jpg',
    description: 'Two matching beds with sage-green linens, broad sunny windows, and a soft, neutral carpet.',
  },
  {
    id: 'R124',
    name: 'Blush Twin Family Room',
    type: 'Family Room',
    price: 360,
    beds: 2,
    baths: 1,
    size: 570,
    maxGuests: 4,
    status: 'Available',
    images: ['public/9b503f429adfb028a8e992748ad9c64b.jpg'],
    image: 'public/9b503f429adfb028a8e992748ad9c64b.jpg',
    description: 'Two separate blush-accented beds, a shared bedside table, and warm decorative lighting.',
  },
  {
    id: 'R125',
    name: 'Classic Double Bed Room',
    type: 'Family Room',
    price: 320,
    beds: 2,
    baths: 1,
    size: 550,
    maxGuests: 4,
    status: 'Available',
    images: ['public/a2cc4e58dd779bcfe9beb5230963e2e0.jpg'],
    image: 'public/a2cc4e58dd779bcfe9beb5230963e2e0.jpg',
    description: 'Two large white beds with a shared bench, framed garden artwork, and a bright curtained window.',
  },
  {
    id: 'R126',
    name: 'Chandelier View Suite',
    type: 'Presidential Suite',
    price: 790,
    beds: 1,
    baths: 1,
    size: 780,
    maxGuests: 2,
    status: 'Available',
    images: ['public/a4db3afc484db280c8e3b1d8754d96f4.jpg'],
    image: 'public/a4db3afc484db280c8e3b1d8754d96f4.jpg',
    description: 'A king bedroom with a crystal chandelier, layered throws, and a large window overlooking snowy scenery.',
  },
  {
    id: 'R127',
    name: 'Rose Canopy Suite',
    type: 'Presidential Suite',
    price: 740,
    beds: 1,
    baths: 1,
    size: 720,
    maxGuests: 2,
    status: 'Available',
    images: ['public/a99075ccf53f984dd1674706329f6de5.jpg'],
    image: 'public/a99075ccf53f984dd1674706329f6de5.jpg',
    description: 'A romantic king bed beneath draped rose-colored fabric and delicate string lights.',
  },
  {
    id: 'R128',
    name: 'Rosewood Twin Family Room',
    type: 'Family Room',
    price: 370,
    beds: 2,
    baths: 1,
    size: 590,
    maxGuests: 4,
    status: 'Available',
    images: ['public/aa7da8d5e94b111a045b5a88f3614d25.jpg'],
    image: 'public/aa7da8d5e94b111a045b5a88f3614d25.jpg',
    description: 'Two separate pink-accented beds, a central chest of drawers, and generous wardrobe storage.',
  },
  {
    id: 'R129',
    name: 'Amber Lounge King Room',
    type: 'Deluxe Suite',
    price: 470,
    beds: 1,
    baths: 1,
    size: 580,
    maxGuests: 2,
    status: 'Available',
    images: ['public/aad01e40af0bda770bd915da92e05034.jpg'],
    image: 'public/aad01e40af0bda770bd915da92e05034.jpg',
    description: 'A king bed with a bold orange headboard, matching bench, ceiling fan, and separate lounge chair.',
  },
  {
    id: 'R130',
    name: 'Teal Twin City Room',
    type: 'Family Room',
    price: 380,
    beds: 2,
    baths: 1,
    size: 600,
    maxGuests: 4,
    status: 'Available',
    images: ['public/ba8e0d67998fec6b8343bd4121b615ed.jpg'],
    image: 'public/ba8e0d67998fec6b8343bd4121b615ed.jpg',
    description: 'Two spacious beds with a shared tufted bench, dark teal wall panels, and a crystal chandelier.',
  },
  {
    id: 'R131',
    name: 'Charcoal Stone King Room',
    type: 'Deluxe Suite',
    price: 420,
    beds: 1,
    baths: 1,
    size: 540,
    maxGuests: 2,
    status: 'Available',
    images: ['public/room5.jpg'],
    image: 'public/room5.jpg',
    description: 'A dark king bedroom with a textured stone wall, layered charcoal bedding, and a tall window beside the bed.',
  },
  {
    id: 'R132',
    name: 'Dark Velvet Four-Poster Suite',
    type: 'Presidential Suite',
    price: 820,
    beds: 1,
    baths: 1,
    size: 820,
    maxGuests: 2,
    status: 'Available',
    images: ['public/bfacf0a46910e32a8405be24c31b86c5.jpg'],
    image: 'public/bfacf0a46910e32a8405be24c31b86c5.jpg',
    description: 'A king bed beneath a dark four-poster canopy with velvet drapes and warm bedside lighting.',
  },
  {
    id: 'R133',
    name: 'Soft Neutral Single Room',
    type: 'Single Room',
    price: 150,
    beds: 1,
    baths: 1,
    size: 270,
    maxGuests: 1,
    status: 'Available',
    images: ['public/c36ba64ebd890ec70cb95174637bff22.jpg'],
    image: 'public/c36ba64ebd890ec70cb95174637bff22.jpg',
    description: 'A compact single-bed room with layered neutral bedding, built-in display shelves, and soft lighting.',
  },
  {
    id: 'R134',
    name: 'Forest Timber King Room',
    type: 'Deluxe Suite',
    price: 380,
    beds: 1,
    baths: 1,
    size: 490,
    maxGuests: 2,
    status: 'Available',
    images: ['public/cbb6fc72672a0213702bb3a3985a467c.jpg'],
    image: 'public/cbb6fc72672a0213702bb3a3985a467c.jpg',
    description: 'A king room with a rustic timber feature wall, forest-green linens, and warm wood furnishings.',
  },
  {
    id: 'R135',
    name: 'Bohemian Canopy Retreat',
    type: 'Deluxe Suite',
    price: 460,
    beds: 1,
    baths: 1,
    size: 560,
    maxGuests: 2,
    status: 'Available',
    images: ['public/cc8d880a4e89e1a2ce8256cbedee851e.jpg'],
    image: 'public/cc8d880a4e89e1a2ce8256cbedee851e.jpg',
    description: 'A king bed framed by a flowing canopy, with potted greenery, framed art, and a sunlit window.',
  },
  {
    id: 'R136',
    name: 'City Night Presidential Room',
    type: 'Presidential Suite',
    price: 850,
    beds: 1,
    baths: 1,
    size: 840,
    maxGuests: 2,
    status: 'Available',
    images: ['public/d2d667b6b43660827bcd568d70fbd17e.jpg'],
    image: 'public/d2d667b6b43660827bcd568d70fbd17e.jpg',
    description: 'A dark, softly lit king bedroom with a night skyline view, a desk, and a television.',
  },
  {
    id: 'R137',
    name: 'Blush Built-In Twin Room',
    type: 'Family Room',
    price: 390,
    beds: 2,
    baths: 1,
    size: 610,
    maxGuests: 4,
    status: 'Available',
    images: ['public/f1b843476671d5cbcaa4fcdd606501a1.jpg'],
    image: 'public/f1b843476671d5cbcaa4fcdd606501a1.jpg',
    description: 'Two separate beds divided by built-in shelving, with blush accents and softly illuminated platforms.',
  },
  {
    id: 'R138',
    name: 'Amber Accent Deluxe Suite',
    type: 'Deluxe Suite',
    price: 480,
    beds: 1,
    baths: 1,
    size: 590,
    maxGuests: 2,
    status: 'Available',
    images: ['public/room3.jpg'],
    image: 'public/room3.jpg',
    description: 'A king bed with a burnt-orange throw, matching lounge bench, and a softly lit sitting area.',
  },
  {
    id: 'R139',
    name: 'Olive Glow King Room',
    type: 'Deluxe Suite',
    price: 390,
    beds: 1,
    baths: 1,
    size: 480,
    maxGuests: 2,
    status: 'Available',
    images: ['public/room6.jpg'],
    image: 'public/room6.jpg',
    description: 'A softly lit king bed with olive bedding, a tall arched mirror, and a television above low storage.',
  },
  {
    id: 'R140',
    name: 'Heritage Four-Poster Suite',
    type: 'Presidential Suite',
    price: 760,
    beds: 1,
    baths: 1,
    size: 680,
    maxGuests: 2,
    status: 'Available',
    images: ['public/a704947cd26e5caa3442864aa89dc1e2.jpg'],
    image: 'public/a704947cd26e5caa3442864aa89dc1e2.jpg',
    description: 'An ornate dark four-poster bed with a pale draped canopy, chandelier, and classic paneled walls.',
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
        <button class="room-card__photo-count" type="button" data-open-gallery data-gallery-title="${escapeHtml(room.name)}" data-gallery-fallback="${escapeHtml(safeImageUrl(room.image))}" data-gallery-images="${escapeHtml(JSON.stringify(room.images))}" aria-label="View ${images.length} photos of ${escapeHtml(room.name)}">
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