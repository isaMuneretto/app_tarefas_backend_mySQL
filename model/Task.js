const db = require("../sequelize");
const Sequelize = require("sequelize");

const Task = db.define("task", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Task.sync();

module.exports = Task;