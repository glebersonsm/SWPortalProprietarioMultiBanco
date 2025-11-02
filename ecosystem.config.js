module.exports = {
  apps: [
    {
      name: 'MeuNextSite',
      // Para Windows, o ideal é rodar o script diretamente.
      // O comando "npm run start" no Windows é um script .cmd.
      // Por isso, rodamos o comando next start diretamente.
      script: 'npm', // Ou 'node' se preferir
      args: ['run', 'start'], // Argumentos para o 'npm'
      cwd: './', // O diretório de trabalho deve ser a raiz do projeto
      instances: 1, // Número de instâncias a rodar
      exec_mode: 'fork', // Modo de execução
      autorestart: true, // Garante que o PM2 reinicie em caso de falha
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000, // Porta em que seu Next.js deve rodar (ajuste se necessário)
      },
    },
  ],
};