const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { logRequest } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

function sendJSON(res, obj, status = 200) {
  const payload = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(payload);
}

function sendText(res, txt, status = 200) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(txt);
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Registrar la petición (no bloqueo)
  logRequest(method, url);

  if (method === 'GET' && url === '/') {
    return sendText(res, 'Bienvenido a Mini API');
  }

  if (method === 'GET' && url === '/about') {
    return sendText(res, 'API creada por Amin de Jesus');
  }

  if (method === 'GET' && url === '/time') {
    const now = { time: new Date().toISOString() };
    return sendJSON(res, now);
  }

  if (method === 'GET' && url === '/users') {
    try {
      const usersPath = path.join(__dirname, 'data', 'users.json');
      const content = await fs.readFile(usersPath, 'utf8');
      const users = JSON.parse(content);
      return sendJSON(res, users);
    } catch (err) {
      console.error('Error leyendo users.json', err);
      return sendJSON(res, { error: 'No se pudo leer users.json' }, 500);
    }
  }

  // Ruta no encontrada
  return sendText(res, '404 Ruta no encontrada', 404);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});