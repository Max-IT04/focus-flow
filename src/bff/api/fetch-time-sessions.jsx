export const fetchTimeSessions = async () => {
  const response = await (fetch('http://localhost:3001/timeSessions'));

  if (!response.ok) {
    return { error: 'Ошибка загрузки замеров', res: null };
  }

  const sessions = await response.json();
  return { error: null, res: sessions };
};