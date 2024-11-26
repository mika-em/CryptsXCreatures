const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CXC API',
      version: '1.0.0',
      description: 'API documentation for CXC API',
    },
    servers: [
      {
        url: 'http://localhost:3000/cxc/api', // Replace with your server URL
      },
    ],
  },
  apis: ['./server.js', './modules/*.js'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;