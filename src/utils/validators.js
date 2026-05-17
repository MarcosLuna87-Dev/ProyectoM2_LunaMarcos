// Función para validar si un ID es un número entero válido
export const isValidId = (id) => {
  // Verificamos que no sea NaN, que sea un número al parsearlo y que sea mayor a 0
  return !isNaN(id) && Number(id) > 0;
};

export const isValidAuthorData = (name, email, bio) => {
  // name y email son NOT NULL en la base de datos, por ende obligatorios
  if (!name || typeof name !== "string" || name.trim() === "") return false;
  if (!email || typeof email !== "string" || email.trim() === "") return false;
  
  // bio es opcional, pero si el usuario manda algo, verificamos que sea un string
  if (bio && typeof bio !== "string") return false;

  return true;
};