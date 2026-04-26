import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { useServerRequest } from "../../hooks"; 
import { logout } from "../../store/slices/user-slice";

const SettingsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const request = useServerRequest();

  const handleLogout = async () => {
    const session = useSelector(selectUserSession);
    await request('logout', session);
    dispatch(logout());
    navigate('/login');
  }
}
export const Settings = () => {
  
  return (

  )
}

