import { getAllPostsService, getPostByIdService } from "../services/postsService.js";
import { isValidId } from "../utils/validators.js";

// Controlador para todos los posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsService();
    return res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error al obtener posts:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para el detalle de un post
export const getPostDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Validamos el ID usando la utilidad que ya tenías
    if (!isValidId(id)) {
      return res.status(400).json({ error: "El ID provisto debe ser un número entero válido" });
    }

    const post = await getPostByIdService(id);

    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("❌ Error al obtener el detalle del post:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};