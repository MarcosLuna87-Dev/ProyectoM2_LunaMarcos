import { Router } from "express";
import { getAllPosts, getPostDetail, getPostsByAuthor } from "../controllers/postsController.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostDetail);
router.get("/author/:authorId", getPostsByAuthor)


export default router;