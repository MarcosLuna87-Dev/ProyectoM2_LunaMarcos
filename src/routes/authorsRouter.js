import { Router } from "express";
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor } from "../controllers/authorsController.js";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);
router.put("/:id", updateAuthor);

export default router;


