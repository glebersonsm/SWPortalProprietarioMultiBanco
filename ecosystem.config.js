module.exports = {
  apps: [
    {
      name: 'PortalClienteGr',
      // **AQUI: COLOQUE O CAMINHO COMPLETO DO node.exe QUE VOCÊ COPIOU**
      // Exemplo (adapte para o seu caminho real):
      script: 'C:\\SWSolucoes\\SWPortalProprietarioMultiBanco\\node_modules\\next\\dist\\bin\\next', 
      // Argumentos para o node.exe: o primeiro argumento é o arquivo a ser executado
      args: ['start.js'], 

      cwd: './', 
      instances: 1, 
      exec_mode: 'fork', 
      autorestart: true, 
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000, 
      },
    },
  ],
};