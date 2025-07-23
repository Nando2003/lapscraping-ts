import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { laptopRouter } from './routes/laptop-routes';
import { redisClient } from './external/redis-connection'

async function bootstrap() {
    await redisClient.connect()
    console.log('🚀 Redis conectado')
    
    const app = express();
    
    app.use(express.json());
    app.use('/api', laptopRouter);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(8000, () => {});
}

bootstrap().catch(err => {
    console.error('Erro ao iniciar:', err)
    process.exit(1)
});