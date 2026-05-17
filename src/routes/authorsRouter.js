import { Router } from "express";
import { getAllAuthors } from "../controllers/authorsController.js";

const router = Router();

router.get("/", getAllAuthors);

export default router;


