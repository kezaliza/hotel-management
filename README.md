# Grand Luxe Hotel

A responsive hotel website built with plain HTML, CSS, and vanilla JavaScript. It includes public hotel pages, room search and booking demonstrations, a contact form, and a local admin inbox.

## Project structure

```text
.
├── index.html          # Home page
├── about.html          # Hotel story and team
├── rooms.html          # Room catalog and filters
├── booking.html        # Booking form and summary
├── blog.html           # Hotel and Kigali journal
├── contact.html        # Contact form and location
├── policies.html       # Privacy and demonstration terms
├── admin.html          # Local room inventory and messages inbox
├── css/
│   └── style.css       # Shared design system and responsive styles
├── images/
│   └── rooms/          # Optional local room photos used by room galleries
├── js/
│   ├── main.js         # Shared navigation, home, and contact behavior
│   ├── rooms.js        # Room catalog and room filters
│   ├── booking.js      # Booking form and price calculations
│   └── admin.js        # Contact-message inbox
└── public/
    ├── favicon.svg     # Site icon
    └── room-placeholder.svg
```

## Run locally with Live Server

1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open `index.html`, then choose **Open with Live Server** from the editor context menu (or click **Go Live** in the status bar).
4. Visit the local URL opened by Live Server. Open `admin.html` on the same origin to view messages submitted through the contact form.

Using a local web server is recommended so browser storage and page navigation behave consistently.

## Admin demo login

Demo credentials: **username:** `admin` · **password:** `admin123`.

The current `admin.html` is a front-end demonstration inbox and does not have a login screen or enforce these credentials. They are documentation-only demo values, not authentication. Do not expose real guest information or use this static page as a secured admin system.

## Browser storage

The demonstration stores data in the browser's `localStorage`:

- `hotelRooms` — editable room catalog
- `hotelBookings` — demonstration bookings
- `hotelMessages` — contact form messages
- `favoriteRooms` — favorite room names
- `hotelBookingSearch` and `selectedHotelRoom` — search and booking handoff data
- `hotelDataVersion` — version of the default room catalog

This data is local to the browser profile and is not shared with a server or other devices.

## Room photos

Put local gallery files in `images/rooms/`. The sample Deluxe Suite, Presidential Suite, and Ocean View Room galleries use `deluxe-1.jpg` through `deluxe-3.jpg`, `presidential-1.jpg` through `presidential-2.jpg`, and `oceanview-1.jpg` through `oceanview-3.jpg`. Rooms without a local gallery keep their existing Unsplash photo. A placeholder is shown if an image cannot be loaded.
