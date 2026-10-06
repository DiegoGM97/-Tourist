const express = require('express');
const router = express.Router();
const sql = require('../config/db');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar estado del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 database:
 *                   type: string
 *                   example: connected
 *                 data:
 *                   type: array
 *       500:
 *         description: Error en el servidor
 */
router.get('/health', async (req, res) => {
  try {
    const result = await sql`SELECT 1 as test`;
    res.json({ status: 'ok', database: 'connected', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
