import { Router } from "express";
import { getAllPosts, getPostDetail } from "../controllers/postsController.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostDetail);


export default router;