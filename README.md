# Tienda de ropa - Backend

Backend con **SSR** (HTML con template literals) para una tienda de ropa + dashboard de administración.  
Incluye **API JSON**, **autenticación de admin por sesión**, **tests de integración** y **documentación con Swagger**.

Base de datos en **MongoDB Atlas**. Despliegue en **Render**.

## Demo en vivo

- **Producción (app):** [https://project-break2-backend.onrender.com](https://project-break2-backend.onrender.com)
- **Repositorio (código fuente):** [https://github.com/negrojcb/project-break2-backend](https://github.com/negrojcb/project-break2-backend)

## Stack tecnológico

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- method-override (PUT/DELETE desde formularios HTML)
- express-session (autenticación por sesión)
- Jest + Supertest (tests de integración)
- Swagger / OpenAPI (documentación de API)
- SSR con template literals + CSS estático en `/public`

## Ejecutar en local

1. **Instalar dependencias**

   npm install

2. **Crear `.env` a partir de `.env.example` y completar valores**

   cp .env.example .env

3. **Iniciar servidor en desarrollo**

   npm run dev

## Scripts

- `npm run dev` → inicia el servidor en modo desarrollo
- `npm start` → inicia el servidor
- `npm test` → corre tests de integración (Jest + Supertest)

## Variables de entorno

- `PORT` (opcional, por defecto: `3000`)
- `MONGO_URI` (cadena de conexión de MongoDB Atlas)
- `ADMIN_USER` (usuario administrador)
- `ADMIN_PASS` (contraseña del administrador)
- `SESSION_SECRET` (clave secreta para firmar la cookie de sesión)

## Rutas SSR (HTML)

### Rutas públicas

- `GET /` → redirige a `/products`
- `GET /products` → lista de productos (soporta `?category=...`)
- `GET /products/:productId` → detalle de producto

### Rutas de dashboard (admin)

- `GET /dashboard` → lista admin + acciones
- `GET /dashboard/new` → formulario para crear producto
- `POST /dashboard` → crear producto (redirect a dashboard)
- `GET /dashboard/:productId` → detalle admin
- `GET /dashboard/:productId/edit` → formulario para editar producto
- `PUT /dashboard/:productId` → actualizar producto
- `DELETE /dashboard/:productId/delete` → eliminar producto

## API JSON

Ruta base: `/api`

- `GET /api/products` → lista de productos (soporta `?category=...`)
- `GET /api/products/:productId` → detalle de producto
- `POST /api/products` → crear producto (body JSON)
- `PUT /api/products/:productId` → actualizar producto (body JSON)
- `DELETE /api/products/:productId` → eliminar producto

## Documentación de API con Swagger

Swagger UI está disponible en:

- **Local:** `/api-docs`
- **Producción (Render):** `/api-docs`

Documenta y permite probar los endpoints de la API JSON de productos bajo `/api/products`.

## Testing

Tests de integración de la API JSON con **Jest** + **Supertest**.

### Ejecutar tests

    npm test

### Endpoints cubiertos

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:productId`
- `DELETE /api/products/:productId`

> Nota: actualmente los tests corren contra la base de datos configurada en `MONGO_URI`.

## Autenticación de admin

- `GET /login` → formulario de login
- `GET /logout` → cierre de sesión
- Las rutas `/dashboard*` están protegidas por middleware de sesión
- Credenciales configuradas mediante variables de entorno: `ADMIN_USER` y `ADMIN_PASS`
