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
- Supports pagination and filtering:
	- /api/contacts?page=1&limit=20
	- /api/contacts?favorite=true|false
- GET /api/contacts/:id — own contact by id
- POST /api/contacts — create contact
	- body: { name, email, phone, favorite? }
- PUT /api/contacts/:id — update any fields
- PATCH /api/contacts/:contactId/favorite — body: { favorite: boolean }
- DELETE /api/contacts/:id — remove contact

## Extra: Update subscription (Bearer token required)
- PATCH /api/auth/subscription
	- body: { subscription: 'starter' | 'pro' | 'business' }
	- 200: { email, subscription }
	- 400: Joi validation error
	- 401: { message: "Not authorized" }

## Quick test (PowerShell)

$body = @{ email="user1@example.com"; password="examplepassword" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -ContentType "application/json" -Body $body
$token = $login.token
$headers = @{ Authorization = "Bearer $token" }

# list (with pagination/filter)
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/contacts?page=1&limit=2" -Headers $headers
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/contacts?favorite=true" -Headers $headers

# update subscription
$sub = @{ subscription = "pro" } | ConvertTo-Json
Invoke-RestMethod -Method Patch -Uri http://localhost:3000/api/auth/subscription -Headers $headers -ContentType "application/json" -Body $sub

## DB notes
- Contacts are per user via `owner` column. If you already had rows, add and backfill `owner` then set NOT NULL.

