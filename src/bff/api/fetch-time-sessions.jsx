export const fetchTimeSessions = async (session) => {
  const user = session?.user;
  if (!user) {
    return { error: 'Нет авторизации', res: null };
  }

  const response = await fetch(`http://localhost:3001/timeSessions?userId=${user.id}`);

  if (!response.ok) {
    return { error: 'Ошибка загрузки замеров', res: null };
  }

  const sessions = await response.json();
  return { error: null, res: sessions };
};