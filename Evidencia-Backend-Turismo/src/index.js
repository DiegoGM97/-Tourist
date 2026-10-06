require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const destinosRoutes = require('./routes/destinos');
const hotelesRoutes = require('./routes/hoteles');
const resenasRoutes = require('./routes/resenas');
const favoritosRoutes = require('./routes/favoritos');
const reservasRoutes = require('./routes/reservas');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Turismo Colombia',
      version: '1.0.0',
      description: 'API REST para plataforma de turismo colombiano con destinos, hoteles, reseñas, favoritos y reservas.',
      contact: {
        name: 'Equipo de Desarrollo'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://turistico-zx83.onrender.com',
        description: 'Producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            nombre: {
              type: 'string',
              example: 'Diego Garcia'
            },
            correo: {
              type: 'string',
              format: 'email',
              example: 'diegogarcia@email.com'
            },
            rol: {
              type: 'string',
              enum: ['admin', 'usuario'],
              example: 'usuario'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Destino: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            slug: {
              type: 'string',
              example: 'cartagena'
            },
            nombre: {
              type: 'string',
              example: 'Cartagena de Indias'
            },
            subtitulo: {
              type: 'string'
            },
            descripcion_corta: {
              type: 'string'
            },
            descripcion_larga: {
              type: 'string'
            },
            imagen: {
              type: 'string',
              format: 'uri'
            },
            clima: {
              type: 'string'
            },
            mejor_epoca: {
              type: 'string'
            },
            lugares_interes: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            actividades: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            consejos: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        },
        Hotel: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            slug: {
              type: 'string',
              example: 'hotel-caribe'
            },
            destino_slug: {
              type: 'string',
              example: 'cartagena'
            },
            nombre: {
              type: 'string',
              example: 'Hotel Caribe'
            },
            descripcion: {
              type: 'string'
            },
            precio_noche: {
              type: 'number',
              format: 'float',
              example: 150000
            },
            imagen: {
              type: 'string',
              format: 'uri'
            },
            comodidades: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            estrellas: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              example: 4
            },
            tipo: {
              type: 'string'
            }
          }
        },
        Resena: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            usuario_id: {
              type: 'integer'
            },
            tipo_entidad: {
              type: 'string',
              enum: ['hotel', 'destino']
            },
            entidad_id: {
              type: 'string'
            },
            calificacion: {
              type: 'integer',
              minimum: 1,
              maximum: 5
            },
            comentario: {
              type: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Favorito: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            usuario_id: {
              type: 'integer'
            },
            tipo_entidad: {
              type: 'string',
              enum: ['hotel', 'destino']
            },
            entidad_id: {
              type: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Reserva: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            usuario_id: {
              type: 'integer'
            },
            hotel_slug: {
              type: 'string'
            },
            fecha_inicio: {
              type: 'string',
              format: 'date'
            },
            fecha_fin: {
              type: 'string',
              format: 'date'
            },
            total: {
              type: 'number',
              format: 'float'
            },
            nombre: {
              type: 'string'
            },
            correo: {
              type: 'string',
              format: 'email'
            },
            telefono: {
              type: 'string'
            },
            huespedes: {
              type: 'integer'
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'confirmada', 'cancelada']
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const allowedOrigins = [
  'https://tourist-one-theta.vercel.app',
  `http://localhost:${PORT}`,
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Turismo - Documentación'
}));

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/destinos', destinosRoutes);
app.use('/api/hoteles', hotelesRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/reservas', reservasRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
