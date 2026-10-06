const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("../config/db");
const {
  authMiddleware,
  adminMiddleware,
  JWT_SECRET,
} = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - contrasena
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Diego Garcia
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: diegogarcia@email.com
 *               contrasena:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Campos obligatorios faltantes o correo ya registrado
 *       500:
 *         description: Error en el servidor
 */
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    if (contrasena.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existing =
      await sql`SELECT id FROM usuarios WHERE correo = ${correo}`;
    if (existing.length > 0) {
      return res.status(400).json({ error: "Este correo ya está registrado" });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const result = await sql`
      INSERT INTO usuarios (nombre, correo, password)
      VALUES (${nombre}, ${correo}, ${hash})
      RETURNING id, nombre, correo, rol, created_at
    `;

    const user = result[0];
    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: diegogarcia@email.com
 *               contrasena:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Campos obligatorios faltantes
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios" });
    }

    const result = await sql`SELECT * FROM usuarios WHERE correo = ${correo}`;
    if (result.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = result[0];
    const valid = await bcrypt.compare(contrasena, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result =
      await sql`SELECT id, nombre, correo, rol, created_at FROM usuarios WHERE id = ${req.user.id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/usuarios:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (se requiere rol admin)
 *       500:
 *         description: Error en el servidor
 */
router.get("/usuarios", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result =
      await sql`SELECT id, nombre, correo, rol, created_at FROM usuarios ORDER BY created_at DESC`;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
