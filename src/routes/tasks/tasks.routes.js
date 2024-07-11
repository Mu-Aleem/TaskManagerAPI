import { Router } from "express";
import {
  create,
  getAll,
  getSingle,
  deleteTask,
  updateTask,
} from "../../controllers/tasks/tasks.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.route("/create").post(verifyJWT, create);
router.route("/").get(verifyJWT, getAll);
router.route("/:id").get(verifyJWT, getSingle);
router.route("/:id").delete(verifyJWT, deleteTask);
router.route("/:id").patch(verifyJWT, updateTask);

export default router;
