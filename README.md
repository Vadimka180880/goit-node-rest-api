# HW07: Auth (JWT) + Contacts API + Avatars

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
	- 201: { user: { email, subscription, avatarURL } }  // avatarURL генерується через Gravatar
	- 409: { message: "Email in use" }

- POST /api/auth/login
	- body: { email, password }
	- 200: { token, user: { email, subscription } }
	- 401: { message: "Email or password is wrong" }

- GET /api/auth/verify/:verificationToken
	- 200: { message: "Verification successful" }
	- 404: { message: "User not found" }

- POST /api/auth/verify
	- body: { email }
	- 200: { message: "Verification email sent" }
	- 400: { message: "Missing required field email" | "Verification has already been passed" }
	- 404: { message: "User not found" }

- GET /api/auth/current (Bearer token)
	- 200: { email, subscription }

- POST /api/auth/logout (Bearer token)
	- 204 No Content

## Avatars
- Під час реєстрації користувача аватар створюється через Gravatar і зберігається в полі `avatarURL`.
- Статика роздається з папки `public` (шлях до аватарів: `/avatars/...`).
- Завантаження власної аватарки (оновлення):
	- PATCH /api/auth/avatars (Bearer token)
	- Content-Type: multipart/form-data
	- Поле форми: `avatar` (файл зображення)
	- Ліміт розміру: 2MB; дозволені типи: jpeg, png, gif, webp, svg
	- Зображення обробляється через sharp: 250x250, конвертація у JPEG
	- Зберігається в `public/avatars` з унікальною назвою, повертається `{ avatarURL: "/avatars/<file>.jpg" }`
	- 401: { message: "Not authorized" }

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

### Quick test: Avatars

# 1) Логін → токен
$body = @{ email="user1@example.com"; password="examplepassword" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -ContentType "application/json" -Body $body
$token = $login.token

# 2) Завантаження файлу (в PowerShell 5.1 зручно використати curl.exe)
$file = "C:\\GoIt\\Node\\goit-node-rest-api\\public\\avatars\\sample-avatar.svg"  # або ваш .jpg/.png
curl.exe -X PATCH -H "Authorization: Bearer $token" -F "avatar=@$file;type=image/svg+xml" http://localhost:3000/api/auth/avatars

# 3) Перевірка в браузері (підставте значення з avatarURL у відповіді)
# http://localhost:3000/avatars/<ім'я-файлу>.jpg

### Email verification notes
- Після реєстрації в консолі логуються посилання виду `[verify-link] http://localhost:3000/api/auth/verify/<token>`.
- Якщо листа немає — просто відкрийте лінк з консолі в браузері.
- Логін дозволений лише після успішної верифікації.

## DB notes
- Contacts are per user via `owner` column. If you already had rows, add and backfill `owner` then set NOT NULL.
 
### Notes
- Папки для статики: `public/avatars`; тимчасові завантаження: `temp`.
- Якщо порт 3000 зайнятий, можна запустити з `PORT=3001`.
- У PowerShell з `curl.exe` слідкуйте за лапками JSON та правильним `-F` полем `avatar`.
 - Сервер читає `PORT` з оточення (див. `.env`).
 - Дозволені типи для завантаження: jpeg, png, gif, webp, svg (конвертується у JPEG 250x250).
                