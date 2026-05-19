import "dotenv/config";
import { Pool } from "pg";

// Evaluamos si el entorno es de pruebas
const isTestEnv = process.env.NODE_ENV === "test";

// Seleccionamos automáticamente la cadena de conexión correcta
const connectionString = isTestEnv 
  ? process.env.DATABASE_URL_TEST 
  : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
});

// Log para darte superpoderes de visibilidad en la consola
console.log(`🔌 Conectado a la base de datos a través de: ${isTestEnv ? 'ENTORNO DE TEST (miniblog_db_test)' : 'ENTORNO DE DESARROLLO'}`);

export default pool;