// import { getUser } from '../api';
// import { sessions } from "../sessions";

// export const authorize = async (authLogin, authPassword) => {
// 	const user = await getUser(authLogin);

// 	if (!user) {
// 		return {
// 			error: 'Такого пользователя не существует',
// 			res: null,
// 		};
// 	}

// 	const { id, login, password, role_id } = user;

// 	if (authPassword !== password) {
// 		return {
// 			error: 'Неверный пароль',
// 			res: null,
// 		};
// 	}

// 	return {
// 		error: null,
// 		res: {
// 			id,
// 			login,
// 			role_id,
// 			session: sessions.create(user),
// 		},
// 	};
// };

// .......................................................

// bff/operations/authorize.jsx

// ДОСТУПНА НОВАЯ СТАТЬЯ, НО НЕДОСТУПНЫ ПОЛЬЗОВАТЕЛИ

// const API_URL = 'http://localhost:3003';

// export const authorize = async (authLogin, authPassword) => {
// 	try {
//     	// Ищем пользователя с таким логином в JSON Server
// 		const response = await fetch(`${API_URL}/users?login=${authLogin}`);
// 		const users = await response.json();
// 		const user = users[0];

// 	if (!user) {
// 		return {
//         error: 'Такого пользователя не существует',
//         res: null,
// 	};
//     }

//     if (authPassword !== user.password) {
//     return {
//         error: 'Неверный пароль',
//         res: null,
//     };
//     }

//     // Здесь можно добавить создание сессии
//     const session = Date.now().toString();

//     return {
//     error: null,
//     res: {
//         id: user.id,
//         login: user.login,
//         roleId: user.role_id,
//         session: session,
//     },
//     };
// } catch (error) {
//     return {
//     error: error.message,
//     res: null,
//     };
// }
// };

////////////////////////////////////////////////////////////

// НЕДОСТУПНО НИЧЕГО

// // bff/operations/authorize.jsx
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
//   // СОЗДАЁМ СЕССИЮ и сохраняем в хранилище
//   const session = sessions.create(user);
//   return {
//     error: null,
//     res: {
//       id: user.id,
//       login: user.login,
//       roleId: user.role_id,
//       session,
//     },
//   };
// };

// ....................................................

// bff/operations/authorize.jsx
import { getUser } from '../api';
import { sessions } from '../sessions';

export const authorize = async (authLogin, authPassword) => {
  const user = await getUser(authLogin);
  if (!user) {
    return { error: 'Такого пользователя не существует', res: null };
  }
  if (authPassword !== user.password) {
    return { error: 'Неверный пароль', res: null };
  }

  const session = sessions.create(user);
  return {
    error: null,
    res: {
      id: user.id,
      login: user.login,
      roleId: user.roleId,
      session,
    },
  };
};
