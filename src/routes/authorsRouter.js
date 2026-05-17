import { Router } from "express";
import { getAllAuthors, getAuthorById, createAuthor } from "../controllers/authorsController.js";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post("/", createAuthor);

export default router;


