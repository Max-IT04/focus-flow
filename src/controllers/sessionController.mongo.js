const TimeSession = require("../models/TimeSession.mongo");
const Project = require("../models/Project.mongo");

exports.getTimeSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user_id: req.user.id };

    if (req.query.project_id) {
      filter.project_id = req.query.project_id;
    }

    if (req.query.start_date || req.query.end_date) {
      filter.start_time = {};
      if (req.query.start_date) {
        filter.start_time.$gte = new Date(req.query.start_date);
      }
      if (req.query.end_date) {
        filter.start_time.$lte = new Date(req.query.end_date);
      }
    }

    const sessions = await TimeSession.find(filter)
      .populate("project_id", "name")
      .sort({ start_time: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TimeSession.countDocuments(filter);

    res.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GetTimeSessions error:", error);
    res.status(500).json({ message: "Ошибка получения сессий" });
  }
};

exports.createTimeSession = async (req, res) => {
  try {
    const { project_id, duration, start_time, end_time, notes } = req.body;

    const project = await Project.findOne({
      _id: project_id,
      user_id: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Проект не найден" });
    }

    const session = new TimeSession({
      project_id,
      user_id: req.user.id,
      duration,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      notes,
    });

    await session.save();
    await session.populate("project_id", "name");

    res.status(201).json(session);
  } catch (error) {
    console.error("CreateTimeSession error:", error);
    res.status(500).json({ message: "Ошибка создания сессии" });
  }
};

exports.deleteTimeSession = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await TimeSession.findOneAndDelete({
      _id: id,
      user_id: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ message: "Сессия не найдена" });
    }

    res.json({ message: "Сессия удалена" });
  } catch (error) {
    console.error("DeleteTimeSession error:", error);
    res.status(500).json({ message: "Ошибка удаления сессии" });
  }
};
