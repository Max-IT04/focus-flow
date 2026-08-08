import { login as apiLogin } from '../api/auth';

export const authorize = async (authLogin, authPassword) => {
  const result = await apiLogin(authLogin, authPassword);
  if (result.error) return result;
  return { error: null, res: { user: result.res } };
};

// import { getUser } from '../api';
// import { sessions } from '../sessions';

// export const authorize = async (authLogin, authPassword) => {
//   const user = await getUser(authLogin);
//   if (!user) {
//     return { error: 'Такого пользователя не существует', res: null };
//   }
//   if (authPassword !== user.password) {
//     return { error: 'Неверный пароль', res: null };
//   }

//   const session = sessions.create(user);

//   return {
//     error: null,
//     res: {
//       id: user.id,
//       login: user.login,
//       roleId: user.roleId,
//       session,
//       user,
//     },
//   };
// };
