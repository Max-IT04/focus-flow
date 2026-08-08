import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthFormError, Button, H2, Input } from "../../components";
import { setUser, setSession } from "../../store/slices/user-slice";
import { selectUserSession } from "../../store/slices/user-slice";
import { useServerRequest } from "../../hooks/use-server-request";
import styled from "styled-components";

const regFormSchema = yup.object({
  login: yup.string().email('Введите email').required('Email обязателен'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Пароли не совпадают').required('Подтвердите пароль'),
});

const RegistrationContainer = ({ className }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },    
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(regFormSchema),
  });

  const [serverError, setServerError] = useState(null);
  const dispatch = useDispatch();
  const session = useSelector(selectUserSession);
  const navigate = useNavigate();
  const request = useServerRequest();

  if (session) {
    return <Navigate to="/" />
  }

  const onSubmit = async ({ login, password }) => {
    const { error, res } = await request('register', login, password);
    
    if (error) {
      setServerError(error);
      return;
    }

    dispatch(setSession(res.session));
    dispatch(setUser(res.user));
    localStorage.setItem('session', res.session);  
    navigate('/');
  };

  const formError = errors?.login?.message || errors?.password?.message || errors?.confirmPassword?.message;
  const errorMessage = formError || serverError;

  return (
    <div className={className}>
      <H2>Регистрация</H2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input 
          type="text"
          placeholder="Email"
          {...register("login", {
            onChange: () => setServerError(null),
          })}
        />
        <Input 
          type="password"
          placeholder="Придумайте пароль"
          {...register("password", {
            onChange: () => setServerError(null),
          })}
        />
        <Input 
          type="password"
          placeholder="Подтвердите пароль"
          {...register("confirmPassword", {
            onChange: () => setServerError(null),
          })}
        />
        <Button type="submit" disabled={!!formError}>
          Зарегистрироваться
        </Button>
        {errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
      </form>
    </div>
  );
};

export const Registration = styled(RegistrationContainer)`
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

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate } from 'react-router-dom';
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { server } from '../../bff';
// import { AuthFormError, Button, H2, Input } from "../../components";
// import { setUser, setSession } from "../../store/slices/user-slice";
// import { selectUserSession } from "../../store/slices/user-slice";
// import styled from "styled-components";

// const regFormSchema = yup.object({
//   login: yup.string().email('Введите email').required('Email обязателен'),
//   password: yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
//   confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Пароли не совпадают').required('Подтвердите пароль'),
// });

// const RegistrationContainer = ({ className }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },    
//   } = useForm({
//     defaultValues: {
//       login: "",
//       password: "",
//     },
//     resolver: yupResolver(regFormSchema),
//   });

//   const [serverError, setServerError] = useState(null);
//   const dispatch = useDispatch();
//   const session = useSelector(selectUserSession);

//   if (session) {
//     return <Navigate to="/" />
//   }

//   const onSubmit = ({ login, password }) => {
//     server.authorize(login, password).then(({ error, res }) => {
//       if (error) {
//         setServerError(`Ошибка: ${error}`);
//         return;
//       }

//       dispatch(setSession(res.session));
//       dispatch(setUser(res.user));
//     });
//   };

//   const formError = errors?.login?.message || errors?.password?.message;
//   const errorMessage = formError || serverError;

//   return (
//     <div className={className}>
//       <H2>Регистрация</H2>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Input 
//           type="text"
//           placeholder="Придумайте логин"
//           {...register("login", {
//             onChange: () => setServerError(null),
//           })}
//         />
//         <Input 
//           type="password"
//           placeholder="Придумайте пароль"
//           {...register("password", {
//             onChange: () => setServerError(null),
//           })}
//         />
//         <Button type="submit" disabled={!!formError}>
//           Зарегистрироваться
//         </Button>
//         {errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
//       </form>
//     </div>
//   );
// };

// export const Registration = styled(RegistrationContainer)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 100%;

//   & > form {
//     display: flex;
//     flex-direction: column;
//     width: 300px;
//   }
// `;  