import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useServerRequest } from "./hooks";
import { setSession, setUser } from './store/slices/user-slice';

import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout";
import { PrivateRoute } from "./components/private-route/private-route";
import { Authorization, Registration, Projects, ProjectForm } from "./pages";
import { Timer } from "./pages/Timer/timer";
import { Analytics } from "./pages/Analytics/analytics";
import { Settings } from "./pages/Settings/settings";


// const Login = () => <div>Страница входа</div>
// const registration = () => <div>Страница регистрации</div>
// const Projects = () => <div>Список проектов</div>
// const ProjectForm = () => <div>Форма проекта</div>
// const Timer = () => <div>Таймер</div>
// const Analytics = () => <div>Аналитика</div>
// const Settings = () => <div>Настройки</div>

function App() {

  const dispatch = useDispatch();
  const request = useServerRequest();

  useEffect(() => {
    const restoreSession = async () => {
      const sessionId = localStorage.getItem('session');
      if (sessionId) {
        const { error, res } = await request('getSession', sessionId);
        if (!error && res) {
          dispatch(setSession(sessionId));
          dispatch(setUser(res.user));
        }
        if (!error && res) {
          dispatch(setSession(sessionId));
          dispatch(setUser(res.user));
        }
      }
    };
    restoreSession();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/authorization" element={<Authorization />} />
      <Route path="/registration" element={<Registration />} />
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
