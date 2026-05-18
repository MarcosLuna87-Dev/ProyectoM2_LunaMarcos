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

export const createPostService = async (title, content, author_id, published) => {
  const query = `
    INSERT INTO posts (title, content, author_id, published)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  
  // Si published no viene en el body, le pasamos false por defecto explicitamente o manejamos su valor booleano
  const isPublished = published === true;

  const result = await pool.query(query, [title, content, author_id, isPublished]);
  return result.rows[0];
};

export const updatePostService = async (id, title, content, author_id, published) => {
  // COALESCE evalúa los argumentos en orden y se queda con el primero que NO sea NULL.
  // Si $2 es NULL, se queda con la columna existente 'title'.
  const query = `
    UPDATE posts 
    SET 
      title = COALESCE($2, title), 
      content = COALESCE($3, content), 
      author_id = COALESCE($4, author_id), 
      published = COALESCE($5, published) 
    WHERE id = $1 
    RETURNING *;
  `;
  
  const result = await pool.query(query, [id, title, content, author_id, published]);
  
  return result.rows[0];
};

export const deletePostService = async (id) => {
  const query = `
    DELETE FROM posts 
    WHERE id = $1 
    RETURNING *;
  `;
  
  const result = await pool.query(query, [id]);
  
  // Retorna el post eliminado, o undefined si el ID no existía
  return result.rows[0];
};