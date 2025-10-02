/**
 * @file Controlador de usuarios: maneja requests/responses.
 */
import { User, Post } from "../models/index.js";
import { crearUsuarioConPost } from "../services/userService.js";

export default {
  /**
   * GET /usuarios - Lista usuarios con sus publicaciones.
   */
  async obtenerUsuarios(req, res) {
    try {
      const { page, limit, offset, order } = req.pagination ?? {
        page: 1,
        limit: 10,
        offset: 0,
        order: [["createdAt", "DESC"]],
      };

      const { rows, count } = await User.findAndCountAll({
        offset,
        limit,
        order,
        include: { model: Post, as: "publicaciones" },
        // attributes: , // ej: { exclude: ['email'] } o ['id','nombre']
        // where: { ...filtros }, // pueden agregarse filtros por campo
      });

      const total = count;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const hasPrev = page > 1;
      const hasNext = page < totalPages;

      // Links bonitos (self, prev, next)
      const url = new URL(
        req.protocol + "://" + req.get("host") + req.baseUrl + req.path
      );
      const buildLink = (p) => {
        const u = new URL(url);
        u.searchParams.set("page", String(p));
        u.searchParams.set("limit", String(limit));
        if (req.query.sort) u.searchParams.set("sort", String(req.query.sort));
        return u.toString();
      };

      res.json({
        data: rows,
        meta: {
          total,
          page,
          pageSize: limit,
          totalPages,
          hasPrev,
          hasNext,
        },
        links: {
          self: buildLink(page),
          prev: hasPrev ? buildLink(page - 1) : null,
          next: hasNext ? buildLink(page + 1) : null,
        },
      });
      // Alternativa simple sin paginación ni filtros
      // implementacion del _req para evitar warning de variable no usada
      // const usuarios = await User.findAll({
      //   include: { model: Post, as: "publicaciones" },
      // });
      // res.json(usuarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },

  /**
   * GET /usuarios/:id - Obtiene un usuario por ID (con posts).
   */
  async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await User.findByPk(req.params.id, {
        include: { model: Post, as: "publicaciones" },
      });
      if (!usuario) return res.status(404).json({ error: "No encontrado" });
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  },

  /**
   * POST /usuarios - Crea un usuario simple (sin transacción adicional).
   */
  async crearUsuario(req, res) {
    try {
      const nuevo = await User.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear usuario" });
    }
  },

  /**
   * POST /usuarios/with-post - Crea usuario + post en transacción.
   * Body esperado: { usuario:{nombre,email}, post:{titulo,contenido} }
   */
  async crearUsuarioConPublicacion(req, res) {
    try {
      const { usuario, post } = req.body;
      const result = await crearUsuarioConPost(usuario, post);
      res.status(201).json(result.usuario);
    } catch (err) {
      console.error("Fallo transacción:", err);
      res.status(500).json({ error: "No se pudo crear usuario + post" });
    }
  },

  /**
   * PUT /usuarios/:id - Actualiza datos de un usuario.
   */
  async actualizarUsuario(req, res) {
    try {
      const usuario = await User.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: "No encontrado" });
      await usuario.update(req.body);
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  },

  /**
   * DELETE /usuarios/:id - Elimina un usuario.
   */
  async eliminarUsuario(req, res) {
    try {
      const usuario = await User.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: "No encontrado" });
      await usuario.destroy();
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  },
};
