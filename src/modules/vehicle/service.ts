import { Conflict, NotFound } from '../../shared/utils/errors';
import {
  IVehicle,
  IVehicleCreateRequest,
  IVehicleUpdateRequest,
} from './interfaces';
import VehicleRepository from './repository';

export default class VehicleService {
  private _repository: VehicleRepository;

  constructor(repository = new VehicleRepository()) {
    this._repository = repository;
  }

  public async getAll(): Promise<IVehicle[]> {
    return this._repository.getAll();
  }

  public async getById(id: string): Promise<IVehicle> {
    const Vehicle = await this._repository.getById(id);

    if (!Vehicle) throw new NotFound('Vehicle not found');

    return Vehicle;
  }

  public async create({
    brand,
    chassis,
    model,
    plate,
    renavam,
    year,
  }: IVehicleCreateRequest): Promise<IVehicle> {
    const vehicleExists = await this._repository.getUnique({
      plate,
      chassis,
      renavam,
    });

    if (vehicleExists)
      throw new Conflict(
        `Vehicle ${
          vehicleExists.plate === plate
            ? 'plate'
            : vehicleExists.chassis === chassis
            ? 'chassis'
            : 'renavam'
        } already exists`,
      );

    return this._repository.create({
      brand,
      chassis,
      model,
      plate,
      renavam,
      year,
    });
  }

  public async update(
    id: string,
    payload: IVehicleUpdateRequest,
  ): Promise<IVehicle> {
    const vehicle = await this._repository.getById(id);

    if (!vehicle) throw new NotFound('Vehicle not found');

    const vehicleExists = await this._repository.getUnique({
      plate: payload.plate,
      chassis: payload.chassis,
      renavam: payload.renavam,
      id,
    });

    if (vehicleExists)
      throw new Conflict(
        `Vehicle ${
          vehicleExists.plate === payload.plate
            ? 'plate'
            : vehicleExists.chassis === payload.chassis
            ? 'chassis'
            : 'renavam'
        } already exists`,
      );

    return this._repository.update(id, payload);
  }

  public async delete(id: string): Promise<IVehicle> {
    const vehicle = await this._repository.getById(id);

    if (!vehicle) throw new NotFound('Vehicle not found');

    return this._repository.delete(id);
  }
}
