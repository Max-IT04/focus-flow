import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useServerRequest } from "../../hooks"; 
import { logout, setUser } from "../../store/slices/user-slice";
import { H2, Button, Input, AuthFormError } from '../../components';
import { Authorization } from "../Authorization/authorization";
import { resetProjects } from '../../store/slices/projects-slice';
import { resetSessions } from '../../store/slices/time-sessions-slice';
import { resetTimerState } from '../../store/slices/timer-slice';

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
  const [passwordError, setPasswordError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit, 
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleEmailChange = async () => {
    setEmailError(null);
    setSuccessMessage(null);

    const result = await request('updateUser', user.id, { login: email });

    if (result.error) {
      setEmailError(result.error);
    } else {
      dispatch(setUser(result.res));

      const sessionId = localStorage.getItem('session');
      if (sessionId) {
        const sessionResult = await request('getSession', sessionId);
        if (!sessionResult.error && sessionResult.res) {
          localStorage.setItem('session', sessionId);
        }
      }

      setSuccessMessage('Email успешно обновлен');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handlePasswordChange = async (data) => {
    setPasswordError(null);
    setSuccessMessage(null);

    const result = await request('updatePassword', user.id, {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });

    if (result.error) {
      setPasswordError(result.error);
    } else {
      reset();
      setSuccessMessage('Пароль успешно обновлен');
    }
  };

  const handleLogout = async () => {
    const session = localStorage.getItem('session');
    if (session) {
      await request('logout', session);
      localStorage.removeItem('session');
    }

    dispatch(logout());
    dispatch(resetProjects());
    dispatch(resetSessions());
    dispatch(resetTimerState());
    
    navigate('/authorization');
  }

  if (!user) {
    return <Authorization />
  }

  return (
    <div>
      <H2>Настройки аккаунта</H2>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      <Section>
        <h3>Email</h3>
        <Input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        {emailError && <AuthFormError>{emailError}</AuthFormError>}
        <Button onClick={handleEmailChange}>Обновить email</Button>
      </Section>
    
      <Section>
        <h3>Смена пароля</h3>
        <form onSubmit={handleSubmit(handlePasswordChange)}>
          <Input 
            type="password" 
            placeholder="Старый пароль" 
            {...register('oldPassword')} 
          />
          {errors.oldPassword && <AuthFormError>{errors.oldPassword.message}</AuthFormError>}
          
          <Input 
            type="password" 
            placeholder="Новый пароль" 
            {...register('newPassword')} 
          />
          {errors.newPassword && <AuthFormError>{errors.newPassword.message}</AuthFormError>}
          
          <Input 
            type="password" 
            placeholder="Подтвердите пароль" 
            {...register('confirmPassword')} 
          />
          {errors.confirmPassword && <AuthFormError>{errors.confirmPassword.message}</AuthFormError>}
          
          {passwordError && <AuthFormError>{passwordError}</AuthFormError>}
          
          <Button type="submit">Сменить пароль</Button>
        </form>
      </Section>
      
      <Section>
        <h3>Сессия</h3>
        <LogoutButton onClick={handleLogout}>Выйти из аккаунта</LogoutButton>
      </Section>
    </div>
  )
}

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #b91c1c;
  }
`;

export const Settings = styled(SettingsContainer)`

`;

