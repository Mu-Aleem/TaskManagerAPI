import { Router } from "express";
import {
  create,
  //   getAll,
  //   getSingle,
  //   deleteTask,
  //   updateTask,
} from "../../controllers/tasks/comment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.route("/:taskId/comments").post(verifyJWT, create);

export default router;
