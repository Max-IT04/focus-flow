import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout, setSession, setUser } from '../store/slices/user-slice';
import { useServerRequest } from './use-server-request';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const request = useServerRequest();
  const { session, user } = useSelector(state => state.user);

  const handleLogin = async (login, password) => {
    const { error, res } = await request('authorize', login, password);
    if (!error) {
      dispatch(setSession(res.session));
      dispatch(setUser(res.user));
      localStorage.setItem('session', res.session);
      navigate('/');
    }
    return { error, res };
  };

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('session');
    if (sessionId) await request('logout', sessionId);
    localStorage.removeItem('session');
    dispatch(logout());
    navigate('/authorization');
  };

  return { session, user, login: handleLogin, logout: handleLogout };
}