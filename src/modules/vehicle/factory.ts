import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import VehicleController from './controller';
import VehicleRepository from './repository';
import VehicleRouter from './router';
import VehicleService from './service';

export default class VehicleFactory {
  private static _prisma = new PrismaClient();

  public static get vehicleRouter() {
    const vehicleRepository = new VehicleRepository(VehicleFactory._prisma);
    const vehicleService = new VehicleService(vehicleRepository);
    const vehicleController = new VehicleController(vehicleService);
    const vehicleRouter = new VehicleRouter(Router(), vehicleController);

    return vehicleRouter.router;
  }
}
