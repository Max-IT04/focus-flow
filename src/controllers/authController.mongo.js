const User = require('../models/User.mongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { login, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ login }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Пользователь с таким логином или email уже существует'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = new User({
      login,
      email,
      password_hash,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, login: user.login, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        login: user.login,
        email: user.email,
        role_id: user.role_id,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login }).select('+password_hash');
    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const token = jwt.sign(
      { id: user._id, login: user.login, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        login: user.login,
        email: user.email,
        role_id: user.role_id,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка входа' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      id: user._id,
      login: user.login,
      email: user.email,
      role_id: user.role_id,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Ошибка получения данных пользователя' });
  }
};