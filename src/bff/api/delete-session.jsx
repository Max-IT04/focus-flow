export const deleteSession = (id) =>
  fetch(`http://localhost:3001/sessions/${id}`, {
    method: 'DELETE',
  });