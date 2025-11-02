const { exec } = require('child_process');

// Altere a porta (3000) se necessário
const command = 'npm start -p 3000';

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao iniciar Next.js: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});

console.log(`Next.js iniciado com o comando: ${command}`);