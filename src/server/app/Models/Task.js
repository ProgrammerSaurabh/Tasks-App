module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("tasks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });

  return Task;
};
