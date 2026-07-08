const { TimeSession } = require('../models');

const getSessions = async (req, res) => {
  try {
    const sessions = await TimeSession.findAll({
      where: { user_id: req.userId },
      order: [['start_time', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSession = async (req, res) => {
  try {
    const { project_id, duration, start_time, end_time } = req.body;
    const session = await TimeSession.create({
      project_id: project_id || null,
      user_id: req.userId,
      duration,
      start_time,
      end_time
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TimeSession.destroy({
      where: { id, user_id: req.userId }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSessions, createSession, deleteSession };