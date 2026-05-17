import { Router } from "express";
import { getAllAuthors, getAuthorById } from "../controllers/authorsController.js";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);

export default router;


