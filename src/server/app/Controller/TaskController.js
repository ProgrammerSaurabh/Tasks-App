const moment = require("moment");
const db = require("../../db");
const schedule = require("node-schedule");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.index = async (req, res) => {
  try {
    let filters = {
      attributes: ["id", "title", "description", "status", "due_date"],
      order: [
        ["status", "ASC"],
        ["createdAt", "DESC"],
      ],
      include: {
        model: db.User,
        attributes: ["id", "name"],
      },
    };

    console.log(schedule.scheduledJobs);

    const tasks = await db.Task.findAll(filters);

    tasks.map((task) => {
      task["due_date"] = new Date(task["due_date"]);
      return task;
    });

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.store = async (req, res) => {
  let error = {};
  if (req.body.title.trim() == "") {
    error["title"] = "Title is required";
  }
  if (req.body.due_date.trim() == "") {
    error["due_date"] = "Due date is required";
  }

  if (Object.keys(error).length > 0) {
    return res.status(422).send(error);
  }

  try {
    let dueDate = req.body.due_date.trim();

    const task = await db.Task.create({
      title: req.body.title.trim(),
      due_date: dueDate,
      description: req.body.description.trim() || null,
      userId: req.user.id,
    });

    schedule.scheduleJob("task-" + task.id, dueDate, async () => {
      if (task.status == 0) {
        console.log("Updating");
        const user = await db.User.findOne({
          where: {
            id: {
              [Op.ne]: req.user.id,
              [Op.gt]: req.user.id,
            },
          },
          order: [["id", "ASC"]],
        });

        if (user) {
          await db.Task.update(
            {
              userId: user.id,
            },
            {
              where: { id: task.id },
            }
          );
        }
        schedule.cancelJob("task-" + task.id);
      }
    });

    return res.status(201).json({
      task,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.update = async (req, res) => {
  let error = {};
  if (req.body.title.trim() == "") {
    error["title"] = "Title is required";
  }

  if (Object.keys(error).length > 0) {
    return res.status(422).send(error);
  }

  try {
    await db.Task.update(
      {
        title: req.body.title.trim(),
        description: req.body.description.trim() || null,
      },
      {
        where: { id: req.params.task },
      }
    );

    return res.status(200).json({
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

exports.complete = async (req, res) => {
  try {
    await db.Task.update(
      {
        status: 1,
      },
      {
        where: { id: req.params.task },
      }
    );

    schedule.cancelJob("task-" + req.params.task);

    return res.status(200).json({
      message: "Task marked as completed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

exports.destroy = async (req, res) => {
  try {
    await db.Task.update(
      {
        status: -1,
      },
      {
        where: { id: req.params.task },
      }
    );

    const task = await db.Task.destroy({
      where: { id: req.params.task },
    });

    if (task) {
      schedule.cancelJob("task-" + task.id);

      return res.status(200).json({
        message: "Task deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
