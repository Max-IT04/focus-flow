export const addTimeSession = async (sessionData) => {
  const response = await fetch('http://localhost:3001/timeSessions', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });

  if (!response.ok) return { error: 'Ошибка сохранения', res: null };
  const res = await response.json();
  return { error: null, res };
};