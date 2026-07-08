const { Project } = require('../models');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      user_id: req.userId
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const project = await Project.findOne({
      where: { id, user_id: req.userId }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await project.update({ name, description });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Project.destroy({
      where: { id, user_id: req.userId }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };