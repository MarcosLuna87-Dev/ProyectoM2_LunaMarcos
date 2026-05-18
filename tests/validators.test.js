import { describe, test, expect } from 'vitest';
import { isValidId, isValidEmailFormat, isValidAuthorData, isValidPostData } from "../src/utils/validators.js";

describe("Validators - Unit Tests", () => {

  // ==========================================
  // Tests para isValidId
  // ==========================================
  describe("isValidId", () => {
    test("debería retornar true para IDs numéricos válidos", () => {
      expect(isValidId(1)).toBe(true);
      expect(isValidId("5")).toBe(true);
    });

    test("debería retornar false para IDs menores o iguales a cero", () => {
      expect(isValidId(0)).toBe(false);
      expect(isValidId("-3")).toBe(false);
    });

    test("debería retornar false si el ID contiene letras o es inválido", () => {
      expect(isValidId("abc")).toBe(false);
      expect(isValidId("1a2")).toBe(false);
    });
  });

  // ==========================================
  // Tests para isValidEmailFormat
  // ==========================================
  describe("isValidEmailFormat", () => {
    test("debería retornar true para formatos de correo válidos", () => {
      expect(isValidEmailFormat("marcos@gmail.com")).toBe(true);
      expect(isValidEmailFormat("alumno.henry@academia.com.ar")).toBe(true);
    });

    test("debería retornar false para formatos de correo inválidos", () => {
      expect(isValidEmailFormat("marcos#gmail.com")).toBe(false);
      expect(isValidEmailFormat("marcos@gmail")).toBe(false);
      expect(isValidEmailFormat("@gmail.com")).toBe(false);
      expect(isValidEmailFormat("   ")).toBe(false);
    });
  });

  // ==========================================
  // Tests para isValidAuthorData
  // ==========================================
  describe("isValidAuthorData", () => {
    test("debería retornar true si todos los datos obligatorios son correctos", () => {
      const res = isValidAuthorData("Julio Cortázar", "cortazar@gmail.com", "Escritor argentino");
      expect(res).toBe(true);
    });

    test("debería retornar true aunque no se envíe la biografía (es opcional)", () => {
      const res = isValidAuthorData("Jorge Luis Borges", "borges@gmail.com");
      expect(res).toBe(true);
    });

    test("debería retornar false si falta el nombre o el email", () => {
      expect(isValidAuthorData("", "test@gmail.com")).toBe(false);
      expect(isValidAuthorData("Marcos", "")).toBe(false);
    });

    test("debería retornar false si el email NO tiene un formato válido", () => {
      expect(isValidAuthorData("Marcos", "correo_invalido.com")).toBe(false);
    });

    test("debería retornar false si la bio se envía pero no es un string", () => {
      expect(isValidAuthorData("Marcos", "marcos@gmail.com", 12345)).toBe(false);
    });
  });

  // ==========================================
  // Tests para isValidPostData
  // ==========================================
  describe("isValidPostData", () => {
    test("debería retornar true si el post tiene título, contenido y un author_id válido", () => {
      const res = isValidPostData("Mi Título", "Contenido del post", 2);
      expect(res).toBe(true);
    });

    test("debería retornar false si el título o el contenido están vacíos", () => {
      expect(isValidPostData("", "Contenido válido", 1)).toBe(false);
      expect(isValidPostData("Título válido", "   ", 1)).toBe(false);
    });

    test("debería retornar false si el author_id es inválido, cero o negativo", () => {
      expect(isValidPostData("Título", "Contenido", 0)).toBe(false);
      expect(isValidPostData("Título", "Contenido", -5)).toBe(false);
      expect(isValidPostData("Título", "Contenido", "abc")).toBe(false);
    });
  });

});