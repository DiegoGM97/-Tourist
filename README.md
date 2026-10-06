# Colombia Travel — Aplicación Turística Full Stack

## Descripción

Aplicación web completa para explorar destinos turísticos de Colombia, ver hoteles, reservar, dejar reseñas y gestionar todo desde un panel de administración. El frontend se comunica con el backend exclusivamente a través de una API REST.

---

## Tecnologías

### Frontend

| Tecnología       | Versión | Uso                              |
| ---------------- | ------- | -------------------------------- |
| React            | 19      | Framework de UI                  |
| Vite             | 8       | Bundler y servidor de desarrollo |
| React Router DOM | 7       | Enrutamiento SPA                 |
| Bootstrap        | 5.3     | Estilos y componentes UI         |
| Zod              | 4       | Validación de formularios        |
| react-hot-toast  | 2       | Notificaciones emergentes        |

### Backend

| Tecnología               | Versión | Uso                                 |
| ------------------------ | ------- | ----------------------------------- |
| Node.js                  | 18+     | Runtime del servidor                |
| Express                  | 5       | Framework web y rutas API           |
| Neon PostgreSQL          | —       | Base de datos relacional en la nube |
| @neondatabase/serverless | 1       | Conexión HTTP a Neon                |
| JSON Web Token           | 9       | Autenticación de usuarios           |
| bcryptjs                 | 3       | Encriptación de contraseñas         |
| CORS                     | 2       | Habilitar peticiones cross-origin   |
| swagger-jsdoc            | 6       | Generación de documentación OpenAPI |
| swagger-ui-express       | 5       | UI interactiva de documentación     |

---

## Estructura del proyecto

```
Aplicacion Funcional/
├── Evidencia-Backend-Turismo/    # API REST con Express
│   ├── src/
│   │   ├── config/db.js          # Conexión a Neon PostgreSQL
│   │   ├── middleware/auth.js    # JWT + roles
│   │   ├── routes/               # Rutas de la API (con docs Swagger)
│   │   └── index.js              # Servidor Express + Swagger config
│   └── .env                      # Variables de entorno (DB URL)
│
├── Evidencia-Frontend-Turismo/   # App React con Vite
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── context/              # Estados globales (Auth, Favoritos, etc.)
│   │   ├── pages/
│   │   │   ├── admin/            # Panel de administración (4 tabs)
│   │   │   └── *.jsx             # Páginas principales
│   │   ├── config/api.js         # Cliente API con JWT
│   │   └── App.jsx               # Rutas de la aplicación
│   └── index.html
│
└── README.md
```

---

## Cómo ejecutar

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior

### 1. Backend (terminal 1)

```bash
cd Evidencia-Backend-Turismo
npm install
npm run dev
```

Debe mostrar: `Server running on http://localhost:3000`

### 2. Frontend (terminal 2)

```bash
cd Evidencia-Frontend-Turismo
npm install
npm run dev
```

Abrir en el navegador: **http://localhost:5173**

---

## Usuarios de prueba

| Rol           | Correo                   | Contraseña |
| ------------- | ------------------------ | ---------- |
| Administrador | admin@colombiatravel.com | admin123   |

---

## Funcionalidades

### Cliente

- Explorar destinos turísticos de Colombia
- Ver detalles de hoteles con fotos, precios y comodidades
- Dejar reseñas con calificación (1-5 estrellas)
- Guardar destinos y hoteles en favoritos
- Reservar hoteles con formulario validado
- Ver historial de reservas y favoritos en su perfil

### Administrador

- Panel de administración con 4 secciones:
  - **Destinos**: Crear, editar, eliminar destinos
  - **Hoteles**: Crear, editar, eliminar hoteles
  - **Usuarios**: Ver todos los usuarios registrados
  - **Reservas**: Ver todas las reservas, cambiar estado, contactar clientes por WhatsApp o correo, eliminar reservas

---

## Base de datos (Neon PostgreSQL)

La aplicación usa una base de datos PostgreSQL alojada en [Neon](https://neon.tech). Las tablas son:

- `usuarios` — Usuarios registrados (clientes y admins)
- `destinos` — Destinos turísticos
- `hoteles` — Hoteles asociados a destinos
- `resenas` — Reseñas de usuarios sobre hoteles/destinos
- `favoritos` — Favoritos de cada usuario
- `reservas` — Reservas de hoteles realizadas por usuarios

La conexión está configurada en el archivo `.env` del backend con la variable `DATABASE_URL`.

---

## Documentación de la API

El backend incluye documentación Swagger/OpenAPI disponible en:

**http://localhost:3000/api-docs**

Allí se muestran los 24 endpoints con sus parámetros, esquemas de respuesta y botón "Try it out" para probar directamente desde el navegador.
