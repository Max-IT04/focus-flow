const User = require("../models/User.mongo");

exports.updateSettings = async (req, res) => {
  try {
    const { workingHours, breakTime, theme, notifications } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (workingHours !== undefined) user.settings.workingHours = workingHours;
    if (breakTime !== undefined) user.settings.breakTime = breakTime;
    if (theme !== undefined) user.settings.theme = theme;
    if (notifications !== undefined)
      user.settings.notifications = notifications;

    await user.save();

    res.json({
      message: "Настройки обновлены",
      settings: user.settings,
    });
  } catch (error) {
    console.error("UpdateSettings error:", error);
    res.status(500).json({ message: "Ошибка обновления настроек" });
  }
};
