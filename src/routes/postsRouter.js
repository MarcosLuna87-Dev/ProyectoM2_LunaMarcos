import { Router } from "express";
import { getAllPosts, getPostDetail, getPostsByAuthor, createPost } from "../controllers/postsController.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostDetail);
router.get("/author/:authorId", getPostsByAuthor);
router.post("/", createPost);


export default router;