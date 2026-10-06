const express = require('express');
const sql = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/destinos:
 *   get:
 *     summary: Listar todos los destinos turísticos
 *     tags: [Destinos]
 *     responses:
 *       200:
 *         description: Lista de destinos ordenados por nombre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Destino'
 *       500:
 *         description: Error en el servidor
 */
router.get('/', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM destinos ORDER BY nombre`;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/destinos/{slug}:
 *   get:
 *     summary: Obtener un destino por su slug
 *     tags: [Destinos]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del destino
 *         example: cartagena
 *     responses:
 *       200:
 *         description: Destino encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destino'
 *       404:
 *         description: Destino no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:slug', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM destinos WHERE slug = ${req.params.slug}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Destino no encontrado' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/destinos:
 *   post:
 *     summary: Crear un nuevo destino (solo admin)
 *     tags: [Destinos]
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
 *               - nombre
 *               - descripcion_corta
 *               - descripcion_larga
 *               - imagen
 *             properties:
 *               slug:
 *                 type: string
 *                 example: cartagena
 *               nombre:
 *                 type: string
 *                 example: Cartagena de Indias
 *               subtitulo:
 *                 type: string
 *               descripcion_corta:
 *                 type: string
 *               descripcion_larga:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: uri
 *               clima:
 *                 type: string
 *               mejor_epoca:
 *                 type: string
 *               lugares_interes:
 *                 type: array
 *                 items:
 *                   type: string
 *               actividades:
 *                 type: array
 *                 items:
 *                   type: string
 *               consejos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Destino creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destino'
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
    const { slug, nombre, subtitulo, descripcion_corta, descripcion_larga, imagen, clima, mejor_epoca, lugares_interes, actividades, consejos } = req.body;

    if (!slug || !nombre || !descripcion_corta || !descripcion_larga || !imagen) {
      return res.status(400).json({ error: 'slug, nombre, descripcion_corta, descripcion_larga e imagen son obligatorios' });
    }

    const existing = await sql`SELECT slug FROM destinos WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya existe un destino con ese slug' });
    }

    const result = await sql`
      INSERT INTO destinos (slug, nombre, subtitulo, descripcion_corta, descripcion_larga, imagen, clima, mejor_epoca, lugares_interes, actividades, consejos)
      VALUES (${slug}, ${nombre}, ${subtitulo || ''}, ${descripcion_corta}, ${descripcion_larga}, ${imagen}, ${clima || ''}, ${mejor_epoca || ''}, ${JSON.stringify(lugares_interes || [])}, ${JSON.stringify(actividades || [])}, ${JSON.stringify(consejos || [])})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/destinos/{slug}:
 *   put:
 *     summary: Actualizar un destino existente (solo admin)
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del destino a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion_corta
 *               - descripcion_larga
 *               - imagen
 *             properties:
 *               nombre:
 *                 type: string
 *               subtitulo:
 *                 type: string
 *               descripcion_corta:
 *                 type: string
 *               descripcion_larga:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: uri
 *               clima:
 *                 type: string
 *               mejor_epoca:
 *                 type: string
 *               lugares_interes:
 *                 type: array
 *                 items:
 *                   type: string
 *               actividades:
 *                 type: array
 *                 items:
 *                   type: string
 *               consejos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Destino actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destino'
 *       400:
 *         description: Campos obligatorios faltantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       404:
 *         description: Destino no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/:slug', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nombre, subtitulo, descripcion_corta, descripcion_larga, imagen, clima, mejor_epoca, lugares_interes, actividades, consejos } = req.body;

    const existing = await sql`SELECT slug FROM destinos WHERE slug = ${req.params.slug}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Destino no encontrado' });
    }

    const result = await sql`
      UPDATE destinos SET
        nombre = ${nombre},
        subtitulo = ${subtitulo || ''},
        descripcion_corta = ${descripcion_corta},
        descripcion_larga = ${descripcion_larga},
        imagen = ${imagen},
        clima = ${clima || ''},
        mejor_epoca = ${mejor_epoca || ''},
        lugares_interes = ${JSON.stringify(lugares_interes || [])},
        actividades = ${JSON.stringify(actividades || [])},
        consejos = ${JSON.stringify(consejos || [])}
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
 * /api/destinos/{slug}:
 *   delete:
 *     summary: Eliminar un destino (solo admin)
 *     tags: [Destinos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del destino a eliminar
 *     responses:
 *       200:
 *         description: Destino eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Destino eliminado
 *                 slug:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       404:
 *         description: Destino no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:slug', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await sql`DELETE FROM destinos WHERE slug = ${req.params.slug} RETURNING slug`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Destino no encontrado' });
    }
    res.json({ message: 'Destino eliminado', slug: result[0].slug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
