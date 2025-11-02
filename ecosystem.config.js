module.exports = {
  apps: [
    {
      name: 'PortalClienteGr',
      script: 'npm',
      args: ['run', 'start'],
      
      // *** MUDANÇA CRÍTICA AQUI ***
      // Defina o CWD para a pasta raiz do projeto (onde está o package.json)
      // Ajuste o caminho se o 'ecosystem.config.js' não estiver nesta pasta.
      // Se o 'ecosystem.config.js' estiver na raiz, use o caminho absoluto ou '.'
      // Se o projeto for a pasta 'SWPortalProprietarioMultiBanco', use o caminho completo:
      cwd: '.', 

      instances: 1, 
      exec_mode: 'fork', 
      autorestart: true, 
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000, // Ajuste para a porta correta
      },
    },
  ],
};