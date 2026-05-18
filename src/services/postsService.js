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

export const getPostsByAuthorService = async (authorId) => {
  const query = `
    SELECT 
      p.id, 
      p.title, 
      p.content, 
      p.published, 
      p.created_at,
      a.id AS author_id,
      a.name AS author_name,
      a.email AS author_email
    FROM posts p
    INNER JOIN authors a ON p.author_id = a.id
    WHERE p.author_id = $1;
  `;
  
  const result = await pool.query(query, [authorId]);
  
  // Retornamos todas las filas (un array de posts de ese autor)
  return result.rows;
};