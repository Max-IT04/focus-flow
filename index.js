require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, syncDatabase } = require('./src/models');

const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects');
const sessionRoutes = require('./src/routes/sessions');
const userRoutes = require('./src/routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-sessions', sessionRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

start();
