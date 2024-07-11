import { Comment } from "../../models/commet.model.js";
import { Tasks } from "../../models/task.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const create = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { taskId } = req.params;
  const { content } = req.body;

  const task = await Tasks.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Task not found");
  }
  if (!content) {
    throw new ApiError(400, "All fields are required");
  }

  const newComment = new Comment({
    task: taskId,
    user: userId,
    content,
  });
  await newComment.save();
  task.comments.push(newComment._id);
  await task.save();
  return res
    .status(201)
    .json(new ApiResponse(200, newComment, "Created Successfully"));
});

export { create };
