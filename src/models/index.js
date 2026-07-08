const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const TimeSession = require('./TimeSession');

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
