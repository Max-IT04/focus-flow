const Project = require('../models/Project.mongo');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user_id: req.user.id })
      .sort({ created_at: -1 });
    res.json(projects);
  } catch (error) {
    console.error('GetProjects error:', error);
    res.status(500).json({ message: 'Ошибка получения проектов' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      user_id: req.user.id
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('CreateProject error:', error);
    res.status(500).json({ message: 'Ошибка создания проекта' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findOne({
      _id: id,
      user_id: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('UpdateProject error:', error);
    res.status(500).json({ message: 'Ошибка обновления проекта' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Project.findOneAndDelete({
      _id: id,
      user_id: req.user.id
    });

    if (!result) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    const TimeSession = require('../models/TimeSession.mongo');
    await TimeSession.deleteMany({ project_id: id });

    res.json({ message: 'Проект удален' });
  } catch (error) {
    console.error('DeleteProject error:', error);
    res.status(500).json({ message: 'Ошибка удаления проекта' });
  }
};