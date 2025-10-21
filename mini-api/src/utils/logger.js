const fs = require('fs').promises;
const path = require('path');

const logFile = path.join(__dirname, '..', 'logs.txt');

async function logRequest(method, route) {
  const now = new Date().toISOString();
  const line = `[${now}] Método: ${method} | Ruta: ${route}\n`;
  try {
    await fs.appendFile(logFile, line, 'utf8');
  } catch (err) {
    // Si falla el log, no queremos romper el servidor; lo mostramos en consola
    console.error('Error escribiendo en log:', err);
  }
}

module.exports = { logRequest };