const express = require("express");

const jwtMiddleware = require("../middleware/jwt-middleware");

const router = express.Router();

const UserController = require("../app/Controller/UserController");
const TaskController = require("../app/Controller/TaskController");

router.route("/login").post(UserController.login);
router.route("/register").post(UserController.register);

router.get("/tasks", jwtMiddleware, TaskController.index);
router.post("/tasks", jwtMiddleware, TaskController.store);
router.put("/tasks/:task", jwtMiddleware, TaskController.update);
router.put("/tasks/:task/complete", jwtMiddleware, TaskController.complete);
router.delete("/tasks/:task", jwtMiddleware, TaskController.destroy);

module.exports = router;
