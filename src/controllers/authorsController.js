import { getAllAuthorsService, getAuthorByIdService } from "../services/authorsService.js";
import { isValidId } from "../utils/validators.js";

export const getAllAuthors = async (req, res) => {
  try {    
    const authors = await getAllAuthorsService();
    
    return res.status(200).json(authors);
  } catch (error) {
    console.error("❌ Error al obtener autores:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    // Los parámetros de la URL siempre llegan como strings, los extraemos de req.params
    const { id } = req.params;

    // Usamos nuestra utilidad de validación
    if (!isValidId(id)) {
      return res.status(400).json({ error: "El ID provisto debe ser un número entero válido" });
    }
    
    // Llamamos al servicio pasando el ID
    const author = await getAuthorByIdService(id);
    
    // Si el servicio no encontró ninguna fila, devolvemos un 404 (Not Found)
    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    
    // Si existe, respondemos con el objeto del autor
    return res.status(200).json(author);
  } catch (error) {
    console.error("❌ Error al obtener el detalle del autor:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


