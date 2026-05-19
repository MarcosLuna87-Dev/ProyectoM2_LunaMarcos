export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Logging del error (útil para debugging)
  console.error('Error capturado:', {
    status: statusCode,
    message: message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // No exponer stack trace en producción
  const response = {
    error: message,
    status: statusCode
  };

  // Solo incluir stack trace en desarrollo 
  if (process.env.NODE_ENV === 'development') {   
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}