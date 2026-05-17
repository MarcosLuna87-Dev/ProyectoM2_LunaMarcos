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