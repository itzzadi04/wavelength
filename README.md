# Wavelength

Wavelength is a real-time chat application built with Node.js, Express, MongoDB, and Socket.IO. Users sign up with email verification, log in, join chat rooms, and exchange messages live over WebSockets.

The frontend is vibecoded by Claude.

**Live demo:** [wavelength-4gg1.onrender.com](https://wavelength-4gg1.onrender.com/)

## Features

- **Email-verified signup** — new users receive a one-time OTP by email (via Brevo) that must be verified before their account is active.
- **Secure login** — passwords are hashed with bcrypt, and sessions are managed with JWTs stored in HTTP-only cookies.
- **Real-time chat rooms** — create a room, join it, and chat instantly with everyone in the room via Socket.IO.
- **Chat history** — messages are persisted in MongoDB and replayed to users when they join a room.
- **Authenticated sockets** — every socket connection is verified against the same JWT used for HTTP auth, so only logged-in users can chat.

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- Socket.IO for real-time messaging
- JWT (`jsonwebtoken`) for auth, `bcrypt` for password hashing
- Nodemailer / Brevo API for transactional email (OTP delivery)
- `otp-generator` for OTP codes

**Frontend**
- Single-page app served from `public/index.html`
- Tailwind CSS (via CDN) + Google Fonts
- Vanilla JavaScript with the Socket.IO client
- Vibecoded by Claude

## Project Structure

```
.
├── main.js                    # App entry point — sets up Express, Mongo, and Socket.IO
├── controller/
│   ├── chat.js                 # Socket.IO handlers: join room, send message, leave room
│   ├── createchatroom.js       # REST endpoint to create a chat room
│   ├── login.js                # REST endpoint for login
│   ├── sendmail.js             # Sends verification emails via Brevo
│   ├── sendotp.js              # Generates and sends OTP for signup
│   ├── settingusername.js      # Creates a new user account
│   └── verifyemail.js          # Verifies the OTP and activates the account
├── middleware/
│   ├── checkauth.js            # JWT auth middleware for REST routes
│   └── checksocketauth.js      # JWT auth middleware for Socket.IO connections
├── models/
│   ├── message.js              # Message schema
│   ├── room.js                 # Chat room schema
│   └── users.js                # User schema
├── routes/
│   ├── authroutes.js           # /api/auth/* routes (signup, OTP, verify, login)
│   └── routes.js                # /api/* routes (create chat room)
└── public/
    └── index.html              # Frontend chat UI
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB instance (local or hosted, e.g. MongoDB Atlas)
- A [Brevo](https://www.brevo.com/) account and API key for sending emails

### Installation

```bash
git clone https://github.com/itzzadi04/wavelength.git
cd wavelength
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GMAIL_USER=your_sender_email
GMAIL_APP_PASSWORD=your_gmail_app_password
SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
CLIENT_URL=http://localhost:5000
```

### Running the App

```bash
npm start
```

The server starts on the port specified in `.env` (default `5000`), connects to MongoDB, and serves the frontend from `public/`.

## API Overview

### Auth routes (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/settingusername` | Register a new user (username, password, email) |
| POST | `/send_otp` | Send a verification OTP to a user's email |
| POST | `/verifyemail` | Verify the OTP and activate the account |
| POST | `/login` | Log in and receive a JWT cookie |

### Chat routes (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/createchatroom` | Create a new chat room (requires auth) |

### Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `joinRoom` | client → server | Join a room and receive its message history |
| `chatMessage` | client → server | Send a message to a room |
| `leaveRoom` | client → server | Leave a room |
| `identified` | server → client | Confirms the connected user's identity |
| `roomHistory` | server → client | Sends past messages when joining a room |
| `chatMessage` | server → client | Broadcasts a new message to the room |
| `userJoined` / `userLeft` | server → client | Notifies the room of membership changes |

## License

ISC
