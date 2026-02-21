# Tienda de ropa - Backend (Node + Express + MongoDB)

Backend con SSR (HTML con template literals) para una tienda de ropa + dashboard de administración.
Base de datos en MongoDB Atlas. Despliegue en Render.

## Live demo

- Production: [Live app](https://project-break2-backend.onrender.com)
- Repo: [Source code](https://github.com/negrojcb/project-break2-backend)

## Tech stack

- Node.js, Express
- MongoDB Atlas + Mongoose
- method-override (PUT/DELETE desde formularios)
- SSR con template literals + CSS estático en `/public`

## Run locally

1. Install deps

```bash
npm install
```

2. Create `.env` from `.env.example` and fill values

```bash
cp .env.example .env
```

3. Start dev server

```bash
npm run dev
```

## Environment variables

- `PORT` (optional, default 3000)
- `MONGO_URI` (MongoDB Atlas connection string)
- `ADMIN_USER` (User)
- `ADMIN_PASS` (Password)
- `SESSION_SECRET` (Secret key for signing the session cookie)

## Routes (SSR)

### Public

- `GET /` → redirect a `/products`
- `GET /products` → lista de productos (soporta `?category=...`)
- `GET /products/:productId` → detalle de producto

### Dashboard (admin)

- `GET /dashboard` → lista admin + acciones
- `GET /dashboard/new` → formulario crear producto
- `POST /dashboard` → crear producto (redirect a dashboard)
- `GET /dashboard/:productId` → detalle admin
- `GET /dashboard/:productId/edit` → formulario editar
- `PUT /dashboard/:productId` → actualizar producto (redirect al detalle admin)
- `DELETE /dashboard/:productId/delete` → eliminar producto (redirect a dashboard)

## API (JSON) (bonus)

Base path: `/api`

- `GET /api/products` → lista de productos (soporta `?category=...`)
- `GET /api/products/:productId` → detalle de producto
- `POST /api/products` → crear producto (JSON body)
- `PUT /api/products/:productId` → actualizar producto (JSON body)
- `DELETE /api/products/:productId` → eliminar producto

## Testing (bonus)

Tests de integración de la API JSON con **Jest** + **Supertest**.

### Run tests

```bash
npm test

### Covered endpoints (integration tests)
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:productId`
- `DELETE /api/products/:productId`

> Note: Current tests run against the configured MongoDB database (`MONGO_URI`).

## Admin auth (bonus)

- Login: `GET /login`
- Logout: `GET /logout`
- El dashboard (`/dashboard*`) está protegido por sesión.
- Credenciales via variables de entorno: `ADMIN_USER` y `ADMIN_PASS`.

## Notes

- El campo `image` guarda una URL (por ejemplo Cloudinary) y se renderiza directamente en las vistas.
```
