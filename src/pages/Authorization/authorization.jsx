import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { server } from '../../bff';
import { AuthFormError, Button, H2, Input } from "../../components";
import { setUser, setSession } from "../../store/slices/user-slice";
import { selectUserSession } from "../../store/slices/user-slice";
import styled from "styled-components";

const authFormSchema = yup.object().shape({
  login: yup
    .string()
    .required('Введите логин')
    .email('Введите корректный email')
    .min(3, 'Логин должен содержать не менее 3 символов')
    .max(30, 'Логин должен содержать не более 30 символов'),
  password: yup
    .string()
    .required('Введите пароль')
    .min(6, 'Пароль должен содержать не менее 6 символов')
    .max(30, 'Пароль должен содержать не более 30 символов'),
});

const StyledLink = styled.div`
  text-align: center;
  text-decoration: underline;
  margin: 20px 0;
  font-size: 18px;
  cursor: pointer;
  color: #3b82f6;
`;

const AuthorizationContainer = ({ className }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },    
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: yupResolver(authFormSchema),
  });

  const [serverError, setServerError] = useState(null);
  const dispatch = useDispatch();
  const session = useSelector(selectUserSession);

  if (session) {
    return <Navigate to="/" />
  }

  const onSubmit = ({ login, password }) => {
    server.authorize(login, password).then(({ error, res }) => {
      if (error) {
        setServerError(`Ошибка: ${error}`);
        return;
      }

      dispatch(setSession(res.session));
      dispatch(setUser(res.user));
    });
  };

  const formError = errors?.login?.message || errors?.password?.message;
  const errorMessage = formError || serverError;

  return (
    <div className={className}>
      <H2>Авторизация</H2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input 
          type="text"
          placeholder="Логин"
          {...register("login", {
            onChange: () => setServerError(null),
          })}
        />
        <Input 
          type="password"
          placeholder="Пароль"
          {...register("password", {
            onChange: () => setServerError(null),
          })}
        />
        <Button type="submit" disabled={!!formError}>
          Войти
        </Button>
        {errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
        <StyledLink onClick={() => window.location.href = 'register'}>
          Регистрация
        </StyledLink>
      </form>
    </div>
  );
};

export const Authorization = styled(AuthorizationContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  & > form {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
`;  