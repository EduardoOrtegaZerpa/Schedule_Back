const crypto = require('crypto');

// Obtén la contraseña de la línea de comandos
const password = process.argv[2];

// Verifica que se haya pasado un argumento
if (!password) {
  console.error('Por favor, proporciona una contraseña para hashear.');
  process.exit(1);
}

// Crea el hash SHA-256
const hash = crypto.createHash('sha256').update(password).digest('hex');

// Muestra el hash en la terminal
console.log(hash);
