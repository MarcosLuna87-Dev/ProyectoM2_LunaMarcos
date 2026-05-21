import express from "express";
import cors from "cors";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { notFound } from "./helpers/errors.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Habilitamos CORS de forma global para desarrollo
app.use(cors());

// Cargar la documentación
const swaggerDocument = YAML.load("./openapi.yaml");

app.use(express.json());

// 3. Documentación (Debe ir ANTES del 404)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

app.get("/", (req,res) => {
  res.json({message: "MiniBlog API", version: "1.0"});
});

// Ruta no encontrada - Antes del errorHandler
app.use((req, res, next) => {
  next(notFound(`No se encontró la ruta ${req.method} ${req.originalUrl}`));
});

// Middleware de errores - SIEMPRE AL FINAL
app.use(errorHandler);

export default app;