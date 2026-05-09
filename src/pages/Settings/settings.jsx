import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useServerRequest } from "../../hooks"; 
import { logout, setUser } from "../../store/slices/user-slice";
import { H2, Button, Input, AuthFormError } from '../../components';
import styled from "styled-components";

const passwordSchema = yup.object({
  oldPassword: yup.string().required('Введите старый пароль'),
  newPassword: yup.string().min(6, 'Минимум 6 символов').required('Введите новый пароль'), 
  confirmPassword: yup.string()
  .oneOf([yup.ref('newPassword'), null], 'Пароли не совпадают')
  .required('Подтвердите пароль'),
}); 

const SettingsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const request = useServerRequest();
  const { user } = useSelector(state => state.user);

  const [email, setEmail] = useState(user?.login || '');
  const [emailError, setEmailError] = useState(null);

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

