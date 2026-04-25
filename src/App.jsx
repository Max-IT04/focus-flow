import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout";
import { PrivateRoute } from "./components/private-route/private-route";
import { Authorization } from "./pages";


// const Login = () => <div>Страница входа</div>
const Register = () => <div>Страница регистрации</div>
const Projects = () => <div>Список проектов</div>
const ProjectForm = () => <div>Форма проекта</div>
const Timer = () => <div>Таймер</div>
const Analytics = () => <div>Аналитика</div>
const Settings = () => <div>Настройки</div>

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Authorization />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Timer />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:id" element={<ProjectForm />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
