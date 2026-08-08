const sequelize = require('../config/database');
const User = require('./User.mongo');
const Project = require('./Project.mongo');
const TimeSession = require('./TimeSession.mongo');

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = {
  sequelize,
  User,
  Project,
  TimeSession,
  syncDatabase
};
