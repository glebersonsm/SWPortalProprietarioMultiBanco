module.exports = {
  apps: [
    {
      name: 'PortalClienteGr',
      
      // *** MUDANÇA CRÍTICA 1: O SCRIPT É O EXECUTÁVEL NODE.EXE ***
      script: 'C:\\Program Files\\nodejs\\node.exe', // <-- Seu NODE_PATH
      
      // *** MUDANÇA CRÍTICA 2: O PRIMEIRO ARG É O BINÁRIO NEXT.JS ***
      args: [
          'C:\\SWSolucoes\\SWPortalProprietarioMultiBanco\\node_modules\\next\\dist\\bin\\next', // <-- Seu NEXT_BIN_PATH
          'start', 
          '-p', 
          '3000'
      ], 

      // O CWD deve ser a pasta raiz do projeto!
      cwd: 'C:\\SWSolucoes\\SWPortalProprietarioMultiBanco', 

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