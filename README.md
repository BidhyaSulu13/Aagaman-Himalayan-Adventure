# Himalayan Adventure — Beyond the Trail

A premium Himalayan trekking and adventure travel platform, built as a MERN application. The project is being developed in phases, with frontend discovery and planning experiences implemented first.

## Project structure

```text
Himalayan-adventure/
├── client/                         # React + Vite frontend
│   ├── public/                     # Static files served as-is
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Page.jsx
│   │   │   │   ├── PagePrimitives.jsx
│   │   │   │   └── SectionHeading.jsx
│   │   │   ├── destination/
│   │   │   │   └── DestinationCard.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── maps/
│   │   │   │   └── HimalayanMap.jsx
│   │   │   ├── trek/
│   │   │   │   └── TrekCard.jsx
│   │   │   └── SiteShell.jsx       # Barrel exports for shared components
│   │   ├── context/
│   │   │   ├── FavoritesContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── data/
│   │   │   ├── demoArticles.js
│   │   │   ├── demoDestinations.js
│   │   │   ├── demoTreks.js
│   │   │   └── index.js             # Data exports
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── AuthPage.jsx    # Login/register/reset demo modes
│   │   │   ├── public/
│   │   │   │   ├── About.jsx
│   │   │   │   ├── ArticleDetails.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   ├── DestinationDetails.jsx
│   │   │   │   ├── Destinations.jsx
│   │   │   │   ├── ExploreTreks.jsx
│   │   │   │   ├── Finder.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Journal.jsx
│   │   │   │   ├── MiscPages.jsx   # Not-found and draft policy screens
│   │   │   │   └── TrekDetails.jsx
│   │   │   └── traveler/
│   │   │       ├── BookingPage.jsx # Demo trip-request form
│   │   │       ├── SavedPage.jsx
│   │   │       └── index.js
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx        # Route table
│   │   ├── assets/                  # Imported images and other bundled assets
│   │   ├── hooks/                   # Shared React hooks
│   │   ├── services/                # API calls when the backend is connected
│   │   ├── utils/                   # Shared formatting and helper functions
│   │   ├── App.jsx                  # Browser router and global providers
│   │   ├── Pages.jsx                # Compatibility re-exports for page modules
│   │   ├── index.css               # Global styles and responsive design
│   │   └── main.jsx                # Browser entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/                 # Database and service configuration
│   │   ├── controllers/            # Scaffolding for request handlers
│   │   ├── middleware/             # Scaffolding for request processing/access
│   │   ├── models/                 # Scaffolding for database models
│   │   ├── routes/                 # Scaffolding for API endpoints
│   │   ├── services/               # Scaffolding for business logic/integrations
│   │   ├── utils/                  # Scaffolding for server helpers
│   │   ├── validators/             # Scaffolding for request validation
│   │   ├── app.js                  # Express application setup
│   │   └── server.js               # API startup
│   └── package.json
├── .env.example                    # Example environment variable names
└── README.md
```

The frontend screens, shared components, data, and route table are now separated by feature. `pages/Pages.jsx` is a small compatibility export file. Admin screens and reusable auth/booking components are not present because those features have not been implemented; the server folders are scaffolding, and the current API only has its Express health endpoint.

## Requirements

- Node.js 22.12 or newer (Node.js 24 is suitable)
- npm
- MongoDB connection string for database-backed features

## Local setup

Install each package set from PowerShell:

```powershell
Set-Location E:\Himalayan-adventure\client
npm install
Set-Location E:\Himalayan-adventure\server
npm install
```

For the API, copy the root `.env.example` to `server/.env` and set values as the corresponding features are implemented. Never commit `.env` files or real credentials.

Start the applications in separate terminals:

```powershell
Set-Location E:\Himalayan-adventure\client
npm run dev
```

```powershell
# Project root
cd server
npm run dev
```

## Frontend demonstration

The current frontend includes a responsive homepage, trek browsing and filters, illustrative trek/destination detail pages, an OpenStreetMap region explorer, a deterministic trek finder, journal pages, saved treks in local browser storage, and demo-only contact, auth, and trip-request screens.

The trek, price, article, and destination content is illustrative. No live departures, ratings, customer reviews, account authentication, bookings, email delivery, or database/API integration are connected yet. Forms explicitly identify their demo behavior; submitting them does not send or save personal data. Destination map markers are approximate and are not for navigation.

External images are loaded from Unsplash image URLs and map tiles from OpenStreetMap. Confirm image licensing and any required attribution before public use.

## What remains

The Express health endpoint runs, but MongoDB, authentication, booking management, admin tools, and email integrations remain future phases. No deployment has been configured.

## Development phases

1. Workspace audit, architecture, and project foundation.
2. Responsive design system and public-facing frontend.
3. Trek and destination discovery.
4. Interactive explorer and deterministic trek finder.
5. MongoDB models and REST API.
6. Secure authentication and traveler dashboard.
7. Booking requests and configurable email notifications.
8. Protected administration.
9. Testing, accessibility, performance, and deployment preparation.
10. Integration, documentation, and delivery review.
