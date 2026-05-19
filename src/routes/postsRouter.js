import { Router } from "express";
import { getAllPosts, getPostById, getPostsByAuthor, createPost, updatePost, deletePost } from "../controllers/postsController.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.get("/author/:authorId", getPostsByAuthor);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);


export default router;