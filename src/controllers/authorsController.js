import { getAllAuthorsService } from "../services/authorsService.js";

export const getAllAuthors = async (req, res) => {
  try {    
    const authors = await getAllAuthorsService();
    
    return res.status(200).json(authors);
  } catch (error) {
    console.error("❌ Error al obtener autores:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};



