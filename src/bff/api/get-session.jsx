export const getSession = async (hash) => {
  const response = await fetch(`http://localhost:3001/sessions?hash=${hash}`);
  const sessions = await response.json();
  const session = sessions[0];
  
  if (!session) {
    return { error: 'Сессия не найдена', res: null };
  }

  return { error: null, res: session };
};