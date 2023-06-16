const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expenseapp', 'root', 'nikku@4072', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
