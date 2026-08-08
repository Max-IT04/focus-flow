import { Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  return <Outlet />;
}

// ////////////////////////////////////////

// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectUserSession } from "../../store/slices/user-slice";

// export const PrivateRoute = () => {
//   const session = useSelector(selectUserSession);
//   return session ? <Outlet /> : <Navigate to="/login" />;
// }