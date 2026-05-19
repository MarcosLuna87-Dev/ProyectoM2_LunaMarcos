import { getAllPostsService, getPostByIdService, getPostsByAuthorService, createPostService, updatePostService, deletePostService } from "../services/postsService.js";
import { isValidId, isValidPostData } from "../utils/validators.js";
import { badRequest, notFound, conflict, unauthorized, forbidden, internalError } from "../helpers/errors.js";

// Controlador para todos los posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await getAllPostsService();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// Controlador para el detalle de un post
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validamos el ID usando la utilidad que ya tenías
    if (!isValidId(id)) {
      throw badRequest("El ID provisto debe ser un número entero válido");
    }

    const post = await getPostByIdService(id);

    if (!post) {
      throw notFound("Post no encontrado");
    }

    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getPostsByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    // Validamos el parámetro que entra por la URL
    if (!isValidId(authorId)) {
      throw badRequest("El ID del autor provisto debe ser un número entero válido")
    }

    // Llamamos al servicio con el JOIN
    const posts = await getPostsByAuthorService(authorId);

    // Devolvemos la lista de posts (si no tiene, devolverá un array vacío [])
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;

    // 1. VALIDACIÓN: Tipos de datos correctos y campos obligatorios presentes
    if (!isValidPostData(title, content, author_id)) {
      throw badRequest("El título, contenido y un ID de autor válido son obligatorios");
    }

    // 2. Ejecución del servicio
    const newPost = await createPostService(title, content, author_id, published);

    // 3. Respuesta exitosa (201 Created)
    return res.status(201).json(newPost);
  } catch (error) {    
    // Controlamos el error de clave foránea (author_id no existe en la tabla authors)
    if (error.code === "23503") {
      return next(badRequest("El autor especificado (author_id) no existe")); 
    }

    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, author_id, published } = req.body;

    // 1. Validar ID de la URL (Sigue siendo obligatorio)
    if (!isValidId(id)) {
      throw badRequest("El ID provisto debe ser un número entero válido");
    }

    // 2. VALIDACIONES DINÁMICAS (Solo si el dato viene en el body)
    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      throw badRequest("El título enviado debe ser un texto válido");
    }

    if (content !== undefined && (typeof content !== "string" || content.trim() === "")) {
      throw badRequest("El contenido enviado debe ser un texto válido");
    }

    if (author_id !== undefined && (isNaN(author_id) || Number(author_id) <= 0)) {
      throw badRequest("El author_id enviado debe ser un número entero válido");
    }

    if (published !== undefined && typeof published !== "boolean") {
      throw badRequest("El campo published debe ser un valor booleano");
    }

    // 3. Ejecutar servicio de actualización
    // Si alguna variable es 'undefined', JavaScript la pasa como tal, y node-postgres la convierte en NULL para la query, activando el COALESCE.
    const updatedPost = await updatePostService(
      id, 
      title !== undefined ? title : null, 
      content !== undefined ? content : null, 
      author_id !== undefined ? author_id : null, 
      published !== undefined ? published : null
    );

    // 4. Si el post no existía
    if (!updatedPost) {
      throw notFound("Post no encontrado para actualizar");
    }

    return res.status(200).json(updatedPost);
  } catch (error) {    

    if (error.code === "23503") {
      return next(badRequest("El autor especificado (author_id) no existe"));
    }

    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validar si el ID es un número entero válido
    if (!isValidId(id)) {
      throw badRequest("El ID provisto debe ser un número entero válido");
    }

    // 2. Ejecutar el servicio de borrado
    const deletedPost = await deletePostService(id);

    // 3. Si el post no existía en la base de datos
    if (!deletedPost) {
      throw notFound("Post no encontrado para eliminar");
    }

    // 4. Respuesta exitosa
    return res.status(200).json({
      message: "Post eliminado exitosamente",
      post: deletedPost
    });
  } catch (error) {
    next(error);
  }
};