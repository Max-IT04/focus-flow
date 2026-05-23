export const updatePassword = async (session, id, { oldPassword, newPassword }) => {
  const userFromSession = session?.user;
  if (!userFromSession) {
    return { error: 'Нет авторизации', res: null };
  }
  
  // Проверяем, что пользователь меняет свой пароль
  if (userFromSession.id !== id) {
    return { error: 'Нет доступа', res: null };
  }
  
  const userRes = await fetch(`http://localhost:3001/users/${id}`);
  const userFromDb = await userRes.json();
  
  if (userFromDb.password !== oldPassword) {
    return { error: 'Неверный старый пароль', res: null };
  }
  
  const response = await fetch(`http://localhost:3001/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: newPassword }),
  });
  
  if (!response.ok) return { error: 'Ошибка смены пароля', res: null };
  const res = await response.json();
  return { error: null, res };
};