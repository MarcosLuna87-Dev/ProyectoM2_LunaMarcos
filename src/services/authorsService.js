import pool from "../db/config.js";

export const getAllAuthorsService = async () => { 
  const result = await pool.query("SELECT * FROM authors");
  return result.rows;
};