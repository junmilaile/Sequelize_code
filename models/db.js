const { Sequelize, Model, DataTypes } = require('sequelize');
const { sqlLogger } = require("../logger");

const sequelize = new Sequelize('myschooldb', 'root', 'yangtao1314520', {
  host: 'localhost',
  // 选择一种支持的数据库:
  // 'mysql', 'mariadb', 'postgres', 'mssql', 'sqlite', 'snowflake', 'db2' or 'ibmi'
  dialect: 'mysql',
  logging: (msg) => {
    sqlLogger.info(msg);
  }
});

module.exports = sequelize