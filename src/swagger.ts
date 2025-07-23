import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { OpenAPIV3 } from 'openapi-types';

const routes = process.env.DEBUG === '1' ? path.join(__dirname, 'routes', '*.ts') : path.join(__dirname, 'routes', '*.js');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API de Laptops',
      version: '1.0.0',
      description: 'Docs auto-gerada com Swagger',
    },
  } as OpenAPIV3.Document,
  apis: [routes],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);