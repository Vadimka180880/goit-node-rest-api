# HW07: Auth (JWT) + Contacts API

## Requirements
- Node.js 18+
- PostgreSQL DB (env vars in `.env`)

Create `.env` in project root:

DATABASE_DIALECT=postgres
DATABASE_NAME=...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
DATABASE_HOST=...
DATABASE_PORT=5432
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1h
PORT=3000

## Install & Run

npm install
npm start
# logs: "Database connection successful" / "Server is running..."


## Auth Endpoints
- POST /api/auth/register
	- body: { email, password }
	- 201: { user: { email, subscription } }
	- 409: { message: "Email in use" }

- POST /api/auth/login
	- body: { email, password }
	- 200: { token, user: { email, subscription } }
	- 401: { message: "Email or password is wrong" }

- GET /api/auth/current (Bearer token)
	- 200: { email, subscription }

- POST /api/auth/logout (Bearer token)
	- 204 No Content

## Contacts Endpoints (Bearer token required)
- GET /api/contacts — list own contacts
- GET /api/contacts/:id — own contact by id
- POST /api/contacts — create contact
	- body: { name, email, phone, favorite? }
- PUT /api/contacts/:id — update any fields
- PATCH /api/contacts/:contactId/favorite — body: { favorite: boolean }
- DELETE /api/contacts/:id — remove contact

