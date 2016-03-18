var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'diplomka'
    },
    port: 3000,
    db: 'mongodb://localhost/diplomka-development',
    secretKey:'mySecretKey',
    webdav:{
      "port": 8001,
      "host": "localhost",
      "debugMode": false,
      "rootDir": "/davfsroot",
      "locksDir": "/davfslocks"
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'diplomka'
    },
    port: 3000,
    db: 'mongodb://localhost/diplomka-test',
    secretKey:'mySecretKey'
  },

  production: {
    root: rootPath,
    app: {
      name: 'diplomka'
    },
    port: 3000,
    db: 'mongodb://localhost/diplomka-production',
    secretKey:'mySecretKey'
  }
};

module.exports = config[env];
