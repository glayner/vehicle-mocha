import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import VehicleFactory from './vehicle/factory';
import { swaggerDocument } from './swagger';

const routes = Router();

routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
routes.use('/vehicle', VehicleFactory.vehicleRouter);

export default routes;
