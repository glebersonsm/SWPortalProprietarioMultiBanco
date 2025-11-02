module.exports = {
  apps: [
    {
      name: 'PortalClienteGrGroup',
      script: './node_modules/next/dist/bin/next', // Executa o binário do next
      args: ['start', '-p', '3000'], // Passa os argumentos para ele
      // ... outras configurações
    },
  ],
};