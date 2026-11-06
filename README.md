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

The application includes public trek, destination, region, journal, and contact pages; traveler authentication and booking flows; an admin console; and an Express/MongoDB API. Demo content remains available in the frontend when the API has no matching records.

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

For the API, copy the root `.env.example` to `server/.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `COOKIE_SECRET`. Use independently generated random secrets of at least 32 characters. Never commit `.env` files or real credentials.

To create an administrator without clearing any application data, set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 16 characters in `server/.env`, then run `npm run admin:create` from `server/`. If that admin already exists, add `-- --reset-password` to update its password. This command will not promote a traveler account or modify an existing account unless it is already an admin and the reset flag is provided. Do not reuse a password that has been shared in chat or committed to source.

Email can be simulated in local development. To deliver real messages from a local server, configure Gmail SMTP in `server/.env` as described below.

### Local Gmail email delivery

The API sends mail from the server over Gmail's authenticated SMTP service. Configure `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=finalyearprj534@gmail.com`, and a matching `SMTP_FROM` in `server/.env`. Use Gmail OAuth 2.0 with `SMTP_OAUTH_CLIENT_ID`, `SMTP_OAUTH_CLIENT_SECRET`, and `SMTP_OAUTH_REFRESH_TOKEN` for the recommended setup. For a small project, an account App Password can be set as `SMTP_PASSWORD`; enable 2-Step Verification first and never use the account's normal sign-in password. Keep all credentials in the ignored `.env` file or deployment secret settings, never in source control. Run `npm run email:verify` from `server/` to check SMTP connectivity and authentication, then restart the API after changing its mail settings.

When a signed-in traveler books, the booking request email and a PDF booking summary go to the email on their account. When an admin marks the booking or its departure completed, the traveler receives a congratulations email. For non-account bookings, the lead traveler's booking email is used. In local development without SMTP credentials the server only logs the subject and recipient; it does not deliver a message. Configure the same variables in the deployed API environment for production delivery.

Gmail supports SMTP with TLS on port 465 or STARTTLS on 587. Google's current SMTP guidance supports OAuth 2.0; App Passwords require 2-Step Verification. See [Gmail SMTP setup](https://developers.google.com/workspace/gmail/imap/imap-smtp), [Nodemailer Gmail guidance](https://nodemailer.com/guides/using-gmail), and [Google App Password requirements](https://support.google.com/accounts/answer/185833).

### Traveler sign-in and booking access

The traveler login and registration pages support password sign-in, Google sign-in, and one-time email links. To enable Google sign-in, configure the same Google OAuth web client ID as `GOOGLE_CLIENT_ID` in `server/.env` and `VITE_GOOGLE_CLIENT_ID` in `client/.env` (copy from `client/.env.example`). Add each deployed website origin to the OAuth client's authorized JavaScript origins. One-time sign-in links and booking confirmations require working SMTP settings outside local development.

Travelers must sign in before saving treks or booking a package. Trek listings and details remain public, and anonymous trek views are counted as unverified views. Completed bookings can be reviewed from the dashboard; reviews remain subject to administrator approval.

Start the API and frontend together from the client directory. The API must be
configured and able to start before Vite launches:

```powershell
Set-Location E:\Himalayan-adventure\client
npm run dev
```

This command reuses an already healthy API or starts it, then starts Vite on
port 5173. Visit **http://localhost:5173** in your browser; local development
uses HTTP, not HTTPS. If port 5173 is already occupied, stop the old frontend
process before starting another one. To run only the frontend (when the API is
already running separately), use:

```powershell
npm run dev:client
```

## Application behavior

Public catalog and content routes read from the API, with illustrative frontend content as a fallback. Authentication and administrator operations require the API and MongoDB. Configure SMTP before relying on real email delivery. Seeded trek and destination material is illustrative; verify all route, price, permit, safety, and marketing claims before public use.

External images are loaded from Unsplash image URLs and map tiles from OpenStreetMap. Confirm image licensing and any required attribution before public use.

## Database seeding

The seed script clears existing application collections. It refuses to run unless explicitly confirmed with `npm run seed -- --reset` from `server/`, and requires `SEED_ADMIN_PASSWORD` and `SEED_TRAVELER_PASSWORD` in `server/.env` (each at least 12 characters). Do not run it against a database containing data you need to keep.

There is no automated test suite configured yet. Validate changes with `npm run build` in `client/` and syntax checks or API smoke tests in `server/`. No deployment has been configured, so there is no public website URL yet. After deploying the frontend and API, use the frontend URL provided by the hosting platform.

## Development roadmap

1. Workspace audit, architecture, and project foundation.
2. Responsive design system and public-facing frontend.
3. Trek and destination discovery.
4. Interactive explorer and deterministic trek finder.
5. MongoDB models and REST API.
6. Secure authentication and traveler dashboard.
7. Booking requests and configurable email notifications.
8. Protected administration.
9. Automated testing, accessibility, performance, and deployment preparation.
