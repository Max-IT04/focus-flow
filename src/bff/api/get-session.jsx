export const getSession = (hash) =>
  fetch(`http://localhost:3001/sessions?hash=${hash}`)
    .then((res) => res.json())
    .then((sessions) => sessions[0]);