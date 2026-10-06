const express = require('express');
const sql = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/favoritos:
 *   get:
 *     summary: Listar favoritos del usuario autenticado
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorito'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await sql`SELECT * FROM favoritos WHERE usuario_id = ${req.user.id} ORDER BY created_at DESC`;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/favoritos/toggle:
 *   post:
 *     summary: Agregar o eliminar un favorito (toggle)
 *     tags: [Favoritos]
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
 *             properties:
 *               tipo_entidad:
 *                 type: string
 *                 enum: [hotel, destino]
 *                 example: hotel
 *               entidad_id:
 *                 type: string
 *                 example: hotel-caribe
 *     responses:
 *       200:
 *         description: Favorito agregado o eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 action:
 *                   type: string
 *                   enum: [added, removed]
 *                 favorito:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Favorito'
 *                     - type: 'null'
 *       400:
 *         description: Campos obligatorios faltantes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { tipo_entidad, entidad_id } = req.body;

    if (!tipo_entidad || !entidad_id) {
      return res.status(400).json({ error: 'tipo_entidad y entidad_id son obligatorios' });
    }

    const existing = await sql`
      SELECT id FROM favoritos
      WHERE usuario_id = ${req.user.id} AND tipo_entidad = ${tipo_entidad} AND entidad_id = ${entidad_id}
    `;

    if (existing.length > 0) {
      await sql`DELETE FROM favoritos WHERE id = ${existing[0].id}`;
      return res.json({ action: 'removed', favorito: null });
    }

    const result = await sql`
      INSERT INTO favoritos (usuario_id, tipo_entidad, entidad_id)
      VALUES (${req.user.id}, ${tipo_entidad}, ${entidad_id})
      RETURNING *
    `;
    res.json({ action: 'added', favorito: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
