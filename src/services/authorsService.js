import pool from "../db/config.js";

export const getAllAuthorsService = async () => { 
  const result = await pool.query("SELECT * FROM authors");
  return result.rows;
};

export const getAuthorByIdService = async (id) => {
  // $1 es un marcador de posición seguro para el parámetro id
  const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
  
  // Como buscamos por ID, queremos devolver solo el primer objeto encontrado (o undefined si no existe)
  return result.rows[0];
};

export const createAuthorService = async (name, email, bio) => {
  const query = `
    INSERT INTO authors (name, email, bio) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  
  // Pasamos bio como tercer parámetro. Si viene undefined, node-postgres lo inserta como NULL automáticamente.
  const result = await pool.query(query, [name, email, bio || null]);
  
  return result.rows[0];
};

export const updateAuthorService = async (id, name, email, bio) => {
  const query = `
    UPDATE authors 
    SET name = $2, email = $3, bio = $4 
    WHERE id = $1 
    RETURNING *;
  `;
  
  const result = await pool.query(query, [id, name, email, bio || null]);
  
  // Retornamos la fila actualizada (o undefined si no se modificó nada)
  return result.rows[0];
};