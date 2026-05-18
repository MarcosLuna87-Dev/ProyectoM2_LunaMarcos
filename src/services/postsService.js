import pool from "../db/config.js";

// Obtener todos los posts
export const getAllPostsService = async () => {
  const result = await pool.query("SELECT * FROM posts");
  return result.rows;
};

// Obtener un post por ID
export const getPostByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return result.rows[0];
};