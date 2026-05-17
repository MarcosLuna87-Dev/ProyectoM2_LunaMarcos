import { getAllAuthorsService, getAuthorByIdService, createAuthorService } from "../services/authorsService.js";
import { isValidId, isValidAuthorData } from "../utils/validators.js";

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

export const createAuthor = async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    
    // VALIDACIÓN: Controlamos que los datos cumplan con los tipos esperados
    if (!isValidAuthorData(name, email, bio)) {
      return res.status(400).json({ error: "El nombre y el email son obligatorios y deben ser válidos" });
    }
    
    // Llamamos al servicio para impactar en PostgreSQL
    const newAuthor = await createAuthorService(name, email, bio);
    
    // Respondemos con 201 (Created) y el nuevo objeto insertado
    return res.status(201).json(newAuthor);
  } catch (error) {
    console.error("❌ Error al crear el autor:", error.message);
    
    // Restricción UNIQUE de PostgreSQL: Si el email ya existe, devolvemos un 409 (Conflict)
    if (error.code === "23505") {
      return res.status(409).json({ error: "El email provisto ya está registrado" });
    }
    
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
