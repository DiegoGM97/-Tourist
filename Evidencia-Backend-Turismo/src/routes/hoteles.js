const express = require('express');
const sql = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/hoteles:
 *   get:
 *     summary: Listar todos los hoteles
 *     tags: [Hoteles]
 *     parameters:
 *       - in: query
 *         name: destino
 *         schema:
 *           type: string
 *         description: Filtrar hoteles por slug de destino
 *         example: cartagena
 *     responses:
 *       200:
 *         description: Lista de hoteles ordenados por nombre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       500:
 *         description: Error en el servidor
 */
router.get('/', async (req, res) => {
  try {
    const { destino } = req.query;
    let result;
    if (destino) {
      result = await sql`SELECT * FROM hoteles WHERE destino_slug = ${destino} ORDER BY nombre`;
    } else {
      result = await sql`SELECT * FROM hoteles ORDER BY nombre`;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hoteles/{slug}:
 *   get:
 *     summary: Obtener un hotel por su slug
 *     tags: [Hoteles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del hotel
 *         example: hotel-caribe
 *     responses:
 *       200:
 *         description: Hotel encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:slug', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM hoteles WHERE slug = ${req.params.slug}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hoteles:
 *   post:
 *     summary: Crear un nuevo hotel (solo admin)
 *     tags: [Hoteles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *               - destino_slug
 *               - nombre
 *               - descripcion
 *               - precio_noche
 *               - imagen
 *             properties:
 *               slug:
 *                 type: string
 *                 example: hotel-caribe
 *               destino_slug:
 *                 type: string
 *                 example: cartagena
 *               nombre:
 *                 type: string
 *                 example: Hotel Caribe
 *               descripcion:
 *                 type: string
 *               precio_noche:
 *                 type: number
 *                 format: float
 *                 example: 150000
 *               imagen:
 *                 type: string
 *                 format: uri
 *               comodidades:
 *                 type: array
 *                 items:
 *                   type: string
 *               estrellas:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hotel creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Campos obligatorios faltantes o slug ya existente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { slug, destino_slug, nombre, descripcion, precio_noche, imagen, comodidades, estrellas, tipo } = req.body;

    if (!slug || !destino_slug || !nombre || !descripcion || !precio_noche || !imagen) {
      return res.status(400).json({ error: 'slug, destino_slug, nombre, descripcion, precio_noche e imagen son obligatorios' });
    }

    const existing = await sql`SELECT slug FROM hoteles WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya existe un hotel con ese slug' });
    }

    const destExists = await sql`SELECT slug FROM destinos WHERE slug = ${destino_slug}`;
    if (destExists.length === 0) {
      return res.status(400).json({ error: 'El destino seleccionado no existe' });
    }

    const result = await sql`
      INSERT INTO hoteles (slug, destino_slug, nombre, descripcion, precio_noche, imagen, comodidades, estrellas, tipo)
      VALUES (${slug}, ${destino_slug}, ${nombre}, ${descripcion}, ${precio_noche}, ${imagen}, ${JSON.stringify(comodidades || [])}, ${estrellas || 3}, ${tipo || ''})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hoteles/{slug}:
 *   put:
 *     summary: Actualizar un hotel existente (solo admin)
 *     tags: [Hoteles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del hotel a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destino_slug
 *               - nombre
 *               - descripcion
 *               - precio_noche
 *               - imagen
 *             properties:
 *               destino_slug:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio_noche:
 *                 type: number
 *                 format: float
 *               imagen:
 *                 type: string
 *                 format: uri
 *               comodidades:
 *                 type: array
 *                 items:
 *                   type: string
 *               estrellas:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               tipo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hotel actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Campos obligatorios faltantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       404:
 *         description: Hotel no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/:slug', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { destino_slug, nombre, descripcion, precio_noche, imagen, comodidades, estrellas, tipo } = req.body;

    const existing = await sql`SELECT slug FROM hoteles WHERE slug = ${req.params.slug}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }

    if (destino_slug) {
      const destExists = await sql`SELECT slug FROM destinos WHERE slug = ${destino_slug}`;
      if (destExists.length === 0) {
        return res.status(400).json({ error: 'El destino seleccionado no existe' });
      }
    }

    const result = await sql`
      UPDATE hoteles SET
        destino_slug = ${destino_slug},
        nombre = ${nombre},
        descripcion = ${descripcion},
        precio_noche = ${precio_noche},
        imagen = ${imagen},
        comodidades = ${JSON.stringify(comodidades || [])},
        estrellas = ${estrellas || 3},
        tipo = ${tipo || ''}
      WHERE slug = ${req.params.slug}
      RETURNING *
    `;
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hoteles/{slug}:
 *   delete:
 *     summary: Eliminar un hotel (solo admin)
 *     tags: [Hoteles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del hotel a eliminar
 *     responses:
 *       200:
 *         description: Hotel eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hotel eliminado
 *                 slug:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       404:
 *         description: Hotel no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:slug', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await sql`DELETE FROM hoteles WHERE slug = ${req.params.slug} RETURNING slug`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Hotel no encontrado' });
    }
    res.json({ message: 'Hotel eliminado', slug: result[0].slug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
