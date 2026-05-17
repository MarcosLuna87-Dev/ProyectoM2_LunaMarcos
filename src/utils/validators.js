// Función para validar si un ID es un número entero válido
export const isValidId = (id) => {
  // Verificamos que no sea NaN, que sea un número al parsearlo y que sea mayor a 0
  return !isNaN(id) && Number(id) > 0;
};