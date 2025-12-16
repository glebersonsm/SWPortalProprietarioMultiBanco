module.exports = {
  apps: [
    {
      name: "PortalClienteGr",
      script: "node_modules\\next\\dist\\bin\\next",
      args: "start",

      // O CWD deve ser a pasta raiz do projeto!
      cwd: 'C:\\SWSolucoes\\SWPortalProprietarioMultiBanco', 

      instances: 3, 
      exec_mode: "cluster", 
	  
	  env: {
        NODE_ENV: 'production',
        PORT: 3000, 
      },
      autorestart: true, 
      watch: false,
      max_memory_restart: "400M",
	  log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};