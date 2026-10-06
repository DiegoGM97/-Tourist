const express = require('express');
const sql = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/resenas:
 *   get:
 *     summary: Listar reseñas
 *     tags: [Reseñas]
 *     parameters:
 *       - in: query
 *         name: hotel
 *         schema:
 *           type: string
 *         description: Filtrar reseñas por slug de hotel
 *         example: hotel-caribe
 *       - in: query
 *         name: destino
 *         schema:
 *           type: string
 *         description: Filtrar reseñas por slug de destino
 *         example: cartagena
 *     responses:
 *       200:
 *         description: Lista de reseñas con información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Resena'
 *                   - type: object
 *                     properties:
 *                       usuario_nombre:
 *                         type: string
 *       500:
 *         description: Error en el servidor
 */
router.get('/', async (req, res) => {
  try {
    const { hotel, destino } = req.query;
    let result;
    if (hotel) {
      result = await sql`
        SELECT r.*, u.nombre as usuario_nombre
        FROM resenas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.tipo_entidad = 'hotel' AND r.entidad_id = ${hotel}
        ORDER BY r.created_at DESC
      `;
    } else if (destino) {
      result = await sql`
        SELECT r.*, u.nombre as usuario_nombre
        FROM resenas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.tipo_entidad = 'destino' AND r.entidad_id = ${destino}
        ORDER BY r.created_at DESC
      `;
    } else {
      result = await sql`
        SELECT r.*, u.nombre as usuario_nombre
        FROM resenas r
        JOIN usuarios u ON r.usuario_id = u.id
        ORDER BY r.created_at DESC
      `;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/resenas:
 *   post:
 *     summary: Crear una nueva reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_entidad
 *               - entidad_id
 *               - calificacion
 *             properties:
 *               tipo_entidad:
 *                 type: string
 *                 enum: [hotel, destino]
 *                 example: hotel
 *               entidad_id:
 *                 type: string
 *                 example: hotel-caribe
 *               calificacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comentario:
 *                 type: string
 *                 example: Excelente hotel, muy bonito
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resena'
 *       400:
 *         description: Campos obligatorios faltantes o calificación inválida
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tipo_entidad, entidad_id, calificacion, comentario } = req.body;

    if (!tipo_entidad || !entidad_id || !calificacion) {
      return res.status(400).json({ error: 'tipo_entidad, entidad_id y calificacion son obligatorios' });
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5' });
    }

    const result = await sql`
      INSERT INTO resenas (usuario_id, tipo_entidad, entidad_id, calificacion, comentario)
      VALUES (${req.user.id}, ${tipo_entidad}, ${entidad_id}, ${calificacion}, ${comentario || ''})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
