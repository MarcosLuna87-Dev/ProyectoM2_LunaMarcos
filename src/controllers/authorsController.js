import { getAllAuthorsService, getAuthorByIdService, createAuthorService, updateAuthorService, deleteAuthorService } from "../services/authorsService.js";
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

export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    // 1. Validar ID de la URL
    if (!isValidId(id)) {
      return res.status(400).json({ error: "El ID provisto debe ser un número entero válido" });
    }

    // 2. Validaciones Dinámicas del Body
    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      return res.status(400).json({ error: "El nombre enviado debe ser un texto válido" });
    }

    if (email !== undefined && (typeof email !== "string" || email.trim() === "")) {
      return res.status(400).json({ error: "El email enviado debe ser un texto válido" });
    }

    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({ error: "La biografía enviada debe ser un texto válido" });
    }

    // 3. Ejecutar servicio pasando null si el campo vino undefined
    const updatedAuthor = await updateAuthorService(
      id,
      name !== undefined ? name : null,
      email !== undefined ? email : null,
      bio !== undefined ? bio : null
    );

    // 4. Controlar si existía el autor
    if (!updatedAuthor) {
      return res.status(404).json({ error: "Autor no encontrado para actualizar" });
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error("❌ Error al actualizar el autor:", error.message);

    // Mantenemos el control del email repetido por si intentan parcializar con uno ya usado
    if (error.code === "23505") {
      return res.status(409).json({ error: "El email provisto ya está registrado por otro usuario" });
    }

    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // VALIDACIÓN: ID válido
    if (!isValidId(id)) {
      return res.status(400).json({ error: "El ID provisto debe ser un número entero válido" });
    }
    
    // Llamamos al servicio para eliminar de la base de datos
    const deletedAuthor = await deleteAuthorService(id);
    
    // Si el servicio no devolvió nada, significa que ese ID no existía
    if (!deletedAuthor) {
      return res.status(404).json({ error: "Autor no encontrado para eliminar" });
    }
    
    // Respondemos con éxito y los datos del autor que se fue
    return res.status(200).json({ 
      message: "Autor eliminado exitosamente (y sus posts en cascada)", 
      author: deletedAuthor 
    });
  } catch (error) {
    console.error("❌ Error al eliminar el autor:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};