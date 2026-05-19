import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/config.js';

// Limpieza y reinicio del estado antes de CADA test
beforeEach(async () => {
  await pool.query("TRUNCATE authors RESTART IDENTITY CASCADE");
  
  await pool.query(`
    INSERT INTO authors (name, email, bio) VALUES
      ('Ana', 'ana@example.com', 'Desarrolladora'),
      ('Carlos', 'carlos@example.com', 'Escritor'),
      ('Marcela', 'marcela@example.com', 'Ingeniera');
  `);

  await pool.query(`
    INSERT INTO posts (title, content, author_id, published) VALUES
      ('Tests Intro a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
      ('Tests PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true),
      ('Tests APIs RESTful', 'REST es un estilo arquitectonico...', 1, true),
      ('Tests Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false),
      ('Tests Async/Await explicado', 'Las promesas simplifican el código asíncrono...', 1, false);
  `);
});

// Cerrar el pool al finalizar todas las pruebas del archivo
afterAll(async () => {
  await pool.end();
});

describe("Integration Tests - API Endpoints", () => {

  // ==========================================
  // RUTAS INEXISTENTES (404)
  // ==========================================
  describe("GET /ruta-que-no-existe", () => {
    test("debería responder con 404 y un JSON estructurado por el errorHandler", async () => {
      const response = await request(app).get("/ruta-que-no-existe");
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("No se encontró la ruta GET /ruta-que-no-existe");
    });
  });

  // ==========================================
  // ENDPOINTS DE AUTHORS
  // ==========================================
  describe("CRUD /authors", () => {
    
    test("GET /authors - debería traer todos los autores de la semilla", async () => {
      const response = await request(app).get("/authors");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3); // Sabemos que son 3 por el beforeEach
    });

    test("GET /authors/:id - debería traer un autor específico si existe", async () => {
      const response = await request(app).get("/authors/1"); // Ana
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Ana");
    });

    test("GET /authors/:id - debería dar 404 si el autor no existe", async () => {
      const response = await request(app).get("/authors/999");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toContain("Autor no encontrado");
    });

    test("POST /authors - crea un autor con datos válidos", async () => {
      const response = await request(app)
        .post('/authors')
        .send({ name: 'Juan', email: 'juan@example.com', bio: 'Tester' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Juan');
    });

    test("POST /authors - rechaza si los datos obligatorios fallan en validación", async () => {
      const response = await request(app)
        .post('/authors')
        .send({ name: '', email: 'correo-invalido' }); // Nombre vacío y formato de email roto

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toContain("obligatorios");
    });

    test("POST /authors - rechaza con 409 si el email ya está duplicado", async () => {
      const response = await request(app)
        .post('/authors')
        .send({ name: 'Clon de Ana', email: 'ana@example.com' }); // El email de Ana ya existe en el seed

      expect(response.statusCode).toBe(409);
      expect(response.body.error).toContain("ya está registrado");
    });

    test("PUT /authors/:id - permite actualización parcial (COALESCE)", async () => {
      const response = await request(app)
        .put('/authors/2') // Carlos
        .send({ bio: 'Escritor y Novelista Novato' }); // Solo mandamos la bio

      expect(response.statusCode).toBe(200);
      expect(response.body.bio).toBe('Escritor y Novelista Novato');
      expect(response.body.name).toBe('Carlos'); // Se mantuvo igual gracias a COALESCE
    });

    test("DELETE /authors/:id - elimina un autor existente", async () => {
      const response = await request(app).delete('/authors/3'); // Marcela
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("eliminado exitosamente");
    });

  });
  
  // ==========================================
  // ENDPOINTS DE POSTS
  // ==========================================
  describe("CRUD /posts", () => {

    test("GET /posts - debería traer todos los posts de la semilla", async () => {
      const response = await request(app).get("/posts");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5); // El seed tiene 5 posts
    });

    test("GET /posts/:id - debería traer el detalle de un post existente", async () => {
      const response = await request(app).get("/posts/1"); // 'Tests Intro a Node.js'
      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe("Tests Intro a Node.js");
    });

    test("GET /posts/:id - debería dar 404 si el post no existe", async () => {
      const response = await request(app).get("/posts/999");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toContain("Post no encontrado");
    });

    test("GET /posts/author/:authorId - debería traer los posts de un autor específico", async () => {
      const response = await request(app).get("/posts/author/1"); // Ana tiene 3 posts en el seed
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(3);
    });

    test("POST /posts - crea un post con datos válidos", async () => {
      const response = await request(app)
        .post("/posts")
        .send({
          title: "Nuevo Post de Test",
          content: "Contenido del post de integración...",
          author_id: 2, // Carlos
          published: true
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Nuevo Post de Test");
    });

    test("POST /posts - rechaza con 400 si el author_id no existe (Clave Foránea)", async () => {
      const response = await request(app)
        .post("/posts")
        .send({
          title: "Post Huérfano",
          content: "Este autor no existe en la DB",
          author_id: 999 // ID inexistente
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toContain("no existe");
    });

    test("PUT /posts/:id - permite actualización parcial (COALESCE)", async () => {
      const response = await request(app)
        .put("/posts/4") // 'Tests Manejo de errores en Express' (published: false)
        .send({ published: true }); // Solo cambiamos el estado de publicación

      expect(response.statusCode).toBe(200);
      expect(response.body.published).toBe(true);
      expect(response.body.title).toBe("Tests Manejo de errores en Express"); // Se mantuvo gracias a COALESCE
    });

    test("DELETE /posts/:id - elimina un post existente", async () => {
      const response = await request(app).delete("/posts/5");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("eliminado exitosamente");
    });

    test("PROBANDO CASCADA: Al borrar un autor se deben eliminar sus posts automáticamente", async () => {
      // 1. Borramos al autor ID 2 (Carlos)
      await request(app).delete("/authors/2");

      // 2. Intentamos buscar el post ID 2 que le pertenecía a Carlos
      const response = await request(app).get("/posts/2");
      
      // 3. Debería dar 404 porque el ON DELETE CASCADE de Postgres lo borró de la tabla posts automáticamente
      expect(response.statusCode).toBe(404);
    });

  });
});