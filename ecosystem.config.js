module.exports = {
  apps: [
    {
      name: 'backend-5000',
      script: 'ts-node',
      args: 'src/index.ts',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 5000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'backend-5001',
      script: 'ts-node',
      args: 'src/index.ts',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 5001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'backend-5002',
      script: 'ts-node',
      args: 'src/index.ts',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 5002,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend-3000',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend-3001',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
};
