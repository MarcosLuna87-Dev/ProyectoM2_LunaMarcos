# MiniBlog API 🚀

API REST robusta, escalable y modular para la gestión integral de autores y publicaciones de un blog. La aplicación cuenta con un sistema relacional de base de datos, validaciones estrictas de formatos (emails, IDs y cuerpos de datos) y un manejador global de errores centralizado.

El proyecto cuenta con una suite automatizada de **31 tests (unitarios y de integración)** con reportes de cobertura de código generados mediante Vitest y V8.

*Proyecto construido como estudiante en Henry, diseñado bajo arquitectura limpia y desplegado con éxito en producción.*

---

## 🔗 URL Base del Proyecto

La API se encuentra totalmente operativa en la nube:
* **Producción:** `https://proyectom2lunamarcos-production.up.railway.app`

> ⚠️ *Nota: Los endpoints se acceden directamente desde la raíz del dominio (ej. `/authors`, `/posts`).*

---

## 🛠️ Tecnologías Utilizadas

* **Runtime:** Node.js (v20+)
* **Framework Backend:** Express.js
* **Base de Datos:** PostgreSQL
* **Driver de Conexión:** `pg` (node-postgres Pool)
* **Entorno de Testing:** Vitest & Supertest
* **Reporte de Cobertura:** V8 Coverage
* **Documentación:** OpenAPI 3.1 & Swagger UI (`swagger-ui-express`)
* **Infraestructura de Hosting:** Railway

---

## 📌 Endpoints Disponibles

### Autores
* `GET /authors` - Listar todos los autores registrados.
* `GET /authors/:id` - Obtener el perfil detallado de un autor por su ID.
* `POST /authors` - Registrar un nuevo autor (Valida formato único de Email).
* `PUT /authors/:id` - Actualización parcial y dinámica del autor (`COALESCE`).
* `DELETE /authors/:id` - Eliminar un autor (Acción en cascada sobre sus publicaciones `ON DELETE CASCADE`).

### Publicaciones (Posts)
* `GET /posts` - Listar todas las publicaciones del sistema.
* `GET /posts/:id` - Obtener el detalle de una publicación específica.
* `GET /posts/author/:authorId` - Listar publicaciones de un autor específico (**Entrega datos combinados mediante INNER JOIN**).
* `POST /posts` - Crear un nuevo post (Valida existencia del `author_id` mediante Clave Foránea).
* `PUT /posts/:id` - Actualización parcial y dinámica de la publicación.
* `DELETE /posts/:id` - Remover una publicación específica.

---

## 📊 Ejemplos de Uso (Copy-Paste Ready)

### 1. Comprobar el estado de la API (Ruta Raíz)
```bash
curl https://proyectom2lunamarcos-production.up.railway.app/
```
**Respuesta (200 OK):**

```json
{
  "message": "MiniBlog API",
  "version": "1.0"
}
```

### 2. Obtener todos los autores

```bash
curl https://proyectom2lunamarcos-production.up.railway.app/authors
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Ana Luna",
    "email": "ana@example.com",
    "bio": "Desarrolladora full-stack apasionada por Node.js",
    "created_at": "2026-05-21T00:29:13.065Z"
  },
  {
    "id": 2,
    "name": "Carlos Ruiz",
    "email": "carlos@example.com",
    "bio": "Escritor especializado en bases de datos",
    "created_at": "2026-05-21T00:29:13.065Z"
  },
  {
    "id": 3,
    "name": "Marcela Patoco",
    "email": "marcela@example.com",
    "bio": "Ingeniera de software con foco en APIs REST",
    "created_at": "2026-05-21T00:29:13.065Z"
  }
]
```
### 3. Crear un nuevo autor con validación
```bash
curl -X POST https://proyectom2lunamarcos-production.up.railway.app/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mauricio Portillo",
    "email": "mauri.portillo@example.com",
    "bio": "Estudiante avanzado de programación de APIs"
  }'
```
**Respuesta exitosa (201 Created):**

```json
{
  "id": 4,
  "name": "Mauricio Portillo",
  "email": "mauri.portillo@example.com",
  "bio": "Estudiante avanzado de programaci�n de APIs",
  "created_at": "2026-05-21T13:11:37.226Z"
}
```

### 4. Obtener las publicaciones de un autor mediante INNER JOIN
```bash
curl https://proyectom2lunamarcos-production.up.railway.app/posts/author/2
```
**Respuesta (200 OK):**

```json
[
  {
    "id": 2,
    "title": "PostgreSQL vs MySQL",
    "content": "Ambas bases de datos tienen ventajas...",
    "published": true,
    "created_at": "2026-05-21T00:29:13.287Z",
    "author_id": 2,
    "author_name": "Carlos Ruiz",
    "author_email": "carlos@example.com"
  }
]
```

### 5. Control de Error Centralizado (404 Not Found)
Si se intenta consultar un recurso inexistente:
```bash
curl https://proyectom2lunamarcos-production.up.railway.app/authors/999
```
**Respuesta de Error Estructurada:**

```json
{
  "error": "Autor no encontrado",
  "status": 404
}
```
## 📖 Documentación Interactiva (Swagger UI)

La especificación OpenAPI completa se encuentra embebida de forma nativa en el servidor backend. Podés explorar esquemas de datos, requerimientos de campos y testear las llamadas vivas directamente en tu navegador web ingresando a:

👉 https://proyectom2lunamarcos-production.up.railway.app/api-docs

## 💻 Ejecución del Proyecto en Entorno Local

### Prerrequisitos

- Node.js 20 o superior
- PostgreSQL: Instancia local activa en puerto 5432

### Instrucciones de Instalación

1. Clonar el repositorio:

```bash
git https://github.com/MarcosLuna87-Dev/ProyectoM2_LunaMarcos.git
cd ProyectoM2_LunaMarcos
```

2. Instalar dependencias necesarias:

```bash
npm install
```

3. Configurar variables de entorno:

Crea un archivo `.env` en la raíz del proyecto omando de referencia el archivo `.env.example`:

```
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos
DATABASE_URL_TEST=postgresql://usuario:contraseña@host:puerto/base_de_datos_test

PORT=3000

NODE_ENV=development
```

4. Correr la suite de Tests (Automatizada):

El sistema discrimina de manera transparente el entorno de pruebas protegiendo tus datos locales de desarrollo:

```bash
npm test
```

Para ver el reporte de cobertura de código:

```bash
npm run test:coverage
```

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.