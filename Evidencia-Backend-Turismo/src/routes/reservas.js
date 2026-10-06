const express = require('express');
const sql = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Listar reservas del usuario autenticado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas con información de hotel y destino
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Reserva'
 *                   - type: object
 *                     properties:
 *                       hotel_nombre:
 *                         type: string
 *                       hotel_imagen:
 *                         type: string
 *                       hotel_tipo:
 *                         type: string
 *                       destino_nombre:
 *                         type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await sql`
      SELECT r.*, h.nombre as hotel_nombre, h.imagen as hotel_imagen, h.tipo as hotel_tipo, d.nombre as destino_nombre
      FROM reservas r
      JOIN hoteles h ON r.hotel_slug = h.slug
      JOIN destinos d ON h.destino_slug = d.slug
      WHERE r.correo = ${req.user.correo}
      ORDER BY r.created_at DESC
    `;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotel_slug
 *               - fecha_inicio
 *               - fecha_fin
 *               - total
 *               - nombre
 *               - correo
 *             properties:
 *               hotel_slug:
 *                 type: string
 *                 example: hotel-caribe
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-20
 *               total:
 *                 type: number
 *                 format: float
 *                 example: 750000
 *               nombre:
 *                 type: string
 *                 example: Diego Garcia
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: diegogarcia@email.com
 *               telefono:
 *                 type: string
 *                 example: "+57 300 1234567"
 *               huespedes:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Campos obligatorios faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { hotel_slug, fecha_inicio, fecha_fin, total, nombre, correo, telefono, huespedes } = req.body;

    if (!hotel_slug || !fecha_inicio || !fecha_fin || !total || !nombre || !correo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const result = await sql`
      INSERT INTO reservas (usuario_id, hotel_slug, fecha_inicio, fecha_fin, total, nombre, correo, telefono, huespedes)
      VALUES (${req.user.id}, ${hotel_slug}, ${fecha_inicio}, ${fecha_fin}, ${total}, ${nombre}, ${correo}, ${telefono || ''}, ${huespedes || 1})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/reservas/admin/all:
 *   get:
 *     summary: Listar todas las reservas (solo admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reservas con información de usuario, hotel y destino
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Reserva'
 *                   - type: object
 *                     properties:
 *                       hotel_nombre:
 *                         type: string
 *                       hotel_imagen:
 *                         type: string
 *                       hotel_tipo:
 *                         type: string
 *                       destino_nombre:
 *                         type: string
 *                       usuario_nombre:
 *                         type: string
 *                       usuario_correo:
 *                         type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       500:
 *         description: Error en el servidor
 */
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await sql`
      SELECT r.*, h.nombre as hotel_nombre, h.imagen as hotel_imagen, h.tipo as hotel_tipo, d.nombre as destino_nombre, u.nombre as usuario_nombre, u.correo as usuario_correo
      FROM reservas r
      JOIN hoteles h ON r.hotel_slug = h.slug
      JOIN destinos d ON h.destino_slug = d.slug
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.created_at DESC
    `;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/reservas/{id}/estado:
 *   put:
 *     summary: Actualizar el estado de una reserva (solo admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmada, cancelada]
 *                 example: confirmada
 *     responses:
 *       200:
 *         description: Estado de reserva actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Estado inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id/estado', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado || !["pendiente", "confirmada", "cancelada"].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Use: pendiente, confirmada, cancelada' });
    }
    const result = await sql`
      UPDATE reservas SET estado = ${estado} WHERE id = ${req.params.id} RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva (solo admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva eliminada
 *                 id:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await sql`DELETE FROM reservas WHERE id = ${req.params.id} RETURNING id`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ message: 'Reserva eliminada', id: result[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
