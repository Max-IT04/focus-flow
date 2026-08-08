require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/projects", require("./src/routes/projectRoutes"));
app.use("/api/time-sessions", require("./src/routes/sessionRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Что-то пошло не так!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
