const Sequelize = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    port: process.env.DB_PORT,
    define: {
      paranoid: true,
    },
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+05:30",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./app/Models/User")(sequelize, Sequelize);
db.Task = require("./app/Models/Task")(sequelize, Sequelize);

db.User.hasMany(db.Task);
db.Task.belongsTo(db.User);

module.exports = db;
