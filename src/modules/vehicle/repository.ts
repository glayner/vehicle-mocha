import { PrismaClient } from '@prisma/client';
import {
  IVehicle,
  IVehicleCreateRequest,
  IVehicleGetUniqueRequest,
  IVehicleUpdateRequest,
} from './interfaces';

export default class VehicleRepository {
  private _prisma: PrismaClient;

  constructor(prisma = new PrismaClient()) {
    this._prisma = prisma;
  }

  public async getAll(): Promise<IVehicle[]> {
    return this._prisma.vehicle.findMany();
  }

  public async getById(id: string): Promise<IVehicle | null> {
    const vehicle = this._prisma.vehicle.findUnique({ where: { id } });
    return vehicle;
  }

  public async getUnique({
    plate,
    chassis,
    renavam,
    id,
  }: IVehicleGetUniqueRequest): Promise<IVehicle | null> {
    return this._prisma.vehicle.findFirst({
      where: { OR: [{ chassis }, { renavam }, { plate }], NOT: { id } },
    });
  }

  public async create({
    brand,
    chassis,
    model,
    renavam,
    year,
    plate,
  }: IVehicleCreateRequest): Promise<IVehicle> {
    return this._prisma.vehicle.create({
      data: {
        plate,
        brand,
        chassis,
        model,
        renavam,
        year,
      },
    });
  }

  public async update(
    id: string,
    payload: IVehicleUpdateRequest,
  ): Promise<IVehicle> {
    return this._prisma.vehicle.update({ where: { id }, data: payload });
  }

  public async delete(id: string): Promise<IVehicle> {
    return this._prisma.vehicle.delete({ where: { id } });
  }
}
