const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');

const TimeSession = sequelize.define('TimeSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'time_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

User.hasMany(TimeSession, { foreignKey: 'user_id' });
TimeSession.belongsTo(User, { foreignKey: 'user_id' });
Project.hasMany(TimeSession, { foreignKey: 'project_id' });
TimeSession.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = TimeSession;
