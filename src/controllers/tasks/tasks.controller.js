import { Tasks } from "../../models/task.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const create = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const { title, description, dueDate } = req.body;
  if ([title, description, dueDate].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const task = await Tasks.create({
    title,
    description,
    dueDate,
    userId: userID,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, task, "Task Created Successfully"));
});
const getAll = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const sortOrder = req.query.sortOrder || "desc";
  const sortBy = req.query.sortBy || "dueDate";
  const title = req.query.title;
  const dueDate = req.query.dueDate;

  const totalCount = await Tasks.countDocuments({ userId });
  const totalPages = Math.ceil(totalCount / pageSize);
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const filters = {
    userId,
  };
  if (req.query.status) {
    filters.status = req.query.status;
  }
  if (title) {
    filters.title = { $regex: title, $options: "i" };
  }

  if (dueDate) {
    filters.dueDate = { $gte: new Date(dueDate) };
  }

  const task = await Tasks.find(filters)
    .sort(sortOptions)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();
  const meta = {
    totalCount,
    page,
    pageSize,
    totalPages,
    lastPage: page === totalPages,
  };

  const sendRes = {
    data: task,
    meta,
  };

  return res.status(201).json(new ApiResponse(200, sendRes, ""));
});
const getSingle = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const task = await Tasks.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Task not found");
  }
  return res.status(201).json(new ApiResponse(200, task, ""));
});
const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const deletedTask = await Tasks.findOneAndDelete({ _id: taskId });
  if (!deletedTask) {
    throw new ApiError(400, "Task not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, deletedTask, "deleted Successfully"));
});
const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, dueDate, status } = req.body;
  const updatedTask = await Tasks.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      dueDate,
      status,
    },
    { new: true }
  );
  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  return res
    .status(201)
    .json(new ApiResponse(200, updatedTask, "Updayted Successfully"));
});

export { create, getAll, getSingle, deleteTask, updateTask };
