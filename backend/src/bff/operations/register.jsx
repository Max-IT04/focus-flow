import { register as apiRegister } from '../api/auth';

export const register = async (regLogin, regPassword) => {
  const email = `${regLogin}@focus-flow.local`;
  const result = await apiRegister(regLogin, email, regPassword);
  if (result.error) return result;
  return { error: null, res: { user: result.res } };
};

// import { register as apiRegister } from '../api/auth';

// export const register = async (regLogin, regPassword) => {
//   const result = await apiRegister(regLogin, regLogin, regPassword);
//   if (result.error) return result;
//   return { error: null, res: { user: result.res } };
// };

// import { addUser, getUser } from '../api';
// import { sessions } from "../sessions";

// export const register = async (regLogin, regPassword) => {
// 	const existedUser = await getUser(regLogin);

// 	if (existedUser) {
// 		return {
// 			error: 'Такой пользователь уже существует',
// 			res: null,
// 		};
// 	}

// 	const user = await addUser(regLogin, regPassword);

// 	return {
// 		error: null,
// 		res: {
// 			id: user.id,
// 			login: user.login,
// 			role_id: user.role_id,
// 			session: sessions.create(user),
// 		},
// 	};
// };
