import express from "express";
import router from "./routes/index.js";
import { notFound } from "./helpers/errors.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use(router);

// Ruta no encontrada - Antes del errorHandler
app.use((req, res, next) => {
  next(notFound(`No se encontró la ruta ${req.method} ${req.originalUrl}`));
});

// Middleware de errores - SIEMPRE AL FINAL
app.use(errorHandler);

export default app;