const bcrypt = require("bcrypt");
const { User } = require("../models");

const updateUser = async (req, res) => {
  try {
    const { login, email, password, oldPassword } = req.body;
    const updates = {};

    if (login) updates.login = login;
    if (email) updates.email = email;

    if (password) {
      const user = await User.findByPk(req.userId);

      if (oldPassword) {
        const valid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!valid) {
          return res.status(400).json({ error: "Неверный старый пароль" });
        }
      }

      updates.password_hash = await bcrypt.hash(password, 10);
    }

    await User.update(updates, { where: { id: req.userId } });
    const updatedUser = await User.findByPk(req.userId, {
      attributes: ["id", "login", "email", "role_id"],
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateUser };
