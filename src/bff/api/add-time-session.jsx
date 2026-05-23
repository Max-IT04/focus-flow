export const addTimeSession = async (session, sessionData) => {
  const user = session?.user;
  if (!user) {
    return { error: 'Нет авторизации', res: null };
  }

  const response = await fetch('http://localhost:3001/timeSessions', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      ...sessionData,
      userId: user.id,
    }),
  });

  if (!response.ok) { 
    return { error: 'Ошибка сохранения замера', res: null };
  } 

  const newSession = await response.json();
  return { error: null, res: newSession };
};