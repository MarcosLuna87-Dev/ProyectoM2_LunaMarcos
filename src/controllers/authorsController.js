import { getAllAuthorsService, getAuthorByIdService, createAuthorService, updateAuthorService, deleteAuthorService } from "../services/authorsService.js";
import { isValidId, isValidAuthorData } from "../utils/validators.js";
import { badRequest, notFound, conflict, unauthorized, forbidden, internalError } from "../helpers/errors.js";

export const getAllAuthors = async (req, res, next) => {
  try {    
    const authors = await getAllAuthorsService();
    
    return res.status(200).json(authors);
  } catch (error) {
    next(error);    
  }
};

export const getAuthorById = async (req, res, next) => {
  try {
    // Los parámetros de la URL siempre llegan como strings, los extraemos de req.params
    const { id } = req.params;

    // Usamos nuestra utilidad de validación
    if (!isValidId(id)) {
      throw badRequest("El ID provisto debe ser un número entero válido");
    }
    
    // Llamamos al servicio pasando el ID
    const author = await getAuthorByIdService(id);
    
    // Si el servicio no encontró ninguna fila, Not Found
    if (!author) {
      throw notFound("Autor no encontrado");
    }
    
    // Si existe, respondemos con el objeto del autor
    return res.status(200).json(author);
  } catch (error) {
    next(error);    
  }
};

export const createAuthor = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    
    // VALIDACIÓN: Controlamos que los datos cumplan con los tipos esperados
    if (!isValidAuthorData(name, email, bio)) {
      throw badRequest("El nombre y un email con formato válido son obligatorios");
    }
    
    // Llamamos al servicio para impactar en PostgreSQL
    const newAuthor = await createAuthorService(name, email, bio);
    
    // Respondemos con 201 (Created) y el nuevo objeto insertado
    return res.status(201).json(newAuthor);
  } catch (error) {    
    // Si la base de datos tira el error de email duplicado, lo transformamos en un 409 Conflict
    if (error.code === "23505") {
      return next(conflict("El email provisto ya está registrado por otro usuario"));
    }
    
    // Cualquier otro error inesperado va al manejador global
    next(error);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    // 1. Validar ID de la URL
    if (!isValidId(id)) {
      throw badRequest("El ID provisto debe ser un número entero válido");
    }

    // 2. Validaciones Dinámicas del Body
    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      throw badRequest("El nombre enviado debe ser un texto válido");
    }

    if (email !== undefined && (typeof email !== "string" || email.trim() === "")) {
      throw badRequest("El email enviado debe ser válido");
    }

    if (bio !== undefined && typeof bio !== "string") {
      throw badRequest("La biografía enviada debe ser un texto válido");
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
      throw notFound("Autor no encontrado para actualizar");
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {    

    // Mantenemos el control del email repetido por si intentan parcializar con uno ya usado
    if (error.code === "23505") {
      return next(conflict("El email provisto ya está registrado por otro usuario"));
    }

    next(error);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // VALIDACIÓN: ID válido
    if (!isValidId(id)) {
      throw badRequest("El ID provisto debe ser un número entero válido");
    }
    
    // Llamamos al servicio para eliminar de la base de datos
    const deletedAuthor = await deleteAuthorService(id);
    
    // Si el servicio no devolvió nada, significa que ese ID no existía
    if (!deletedAuthor) {
      throw notFound("Autor no encontrado para eliminar");
    }
    
    // Respondemos con éxito y los datos del autor que se fue
    return res.status(200).json({ 
      message: "Autor eliminado exitosamente (y sus posts en cascada)", 
      author: deletedAuthor 
    });
  } catch (error) {
    next(error);
  }
};