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

export const isValidPostData = (title, content, author_id) => {
  // Validamos que title y content existan, sean strings y no estén vacíos
  if (!title || typeof title !== "string" || title.trim() === "") return false;
  if (!content || typeof content !== "string" || content.trim() === "") return false;
  
  // Validamos que author_id sea un número entero válido y mayor a 0
  if (!author_id || isNaN(author_id) || Number(author_id) <= 0) return false;

  return true;
};