import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from './store/slices/user-slice';
import { getMe, getToken } from './bff/api/auth';

import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout";
import { PrivateRoute } from "./components/private-route/private-route";
import { Authorization, Registration, Projects, ProjectForm } from "./pages";
import { Timer } from "./pages/Timer/timer";
import { Analytics } from "./pages/Analytics/analytics";
import { Settings } from "./pages/Settings/settings";
import { Loader } from "./components";

function App() {
  const dispatch = useDispatch();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (token) {
        const { error, res } = await getMe();
        if (!error && res) {
          dispatch(setUser(res));
        }
      }
      setIsRestoring(false);
    };
    restoreSession();
  }, [dispatch]);

  if (isRestoring) {
    return <Loader />;
  }

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