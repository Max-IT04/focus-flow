export const addUser = (login, password) =>
  fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      login,
      password,
      roleId: 1,        // обычный пользователь
    }),
  }).then((createdUser) => createdUser.json());