import { RequestHandler } from 'express';
import Logger from '../../shared/utils/logger';
import { IVehicleCreateRequest, IVehicleUpdateRequest } from './interfaces';
import VehicleService from './service';

export default class VehicleController {
  private _service: VehicleService;

  constructor(service = new VehicleService()) {
    this._service = service;
  }

  public getAll: RequestHandler = async (_req, res, next) => {
    try {
      const allVehicles = await this._service.getAll();

      res.status(200).json(allVehicles);

      Logger.save('getAll() success');
    } catch (error) {
      Logger.save('getAll() fail');

      next(error);
    }
  };

  public getById: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    try {
      const vehicle = await this._service.getById(id);

      res.status(200).json(vehicle);

      Logger.save('getById() success');
    } catch (error) {
      Logger.save('getById() fail');

      next(error);
    }
  };

  public create: RequestHandler = async (req, res, next) => {
    const { plate, brand, chassis, model, renavam, year } =
      req.body as IVehicleCreateRequest;

    try {
      const newVehicle = await this._service.create({
        plate,
        brand,
        chassis,
        model,
        renavam,
        year,
      });

      res.status(201).json(newVehicle);

      Logger.save('create() success');
    } catch (error) {
      Logger.save('create() fail');

      next(error);
    }
  };

  public update: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    const { plate, brand, chassis, model, renavam, year } =
      req.body as IVehicleUpdateRequest;

    try {
      const updatedVehicle = await this._service.update(id, {
        plate,
        brand,
        chassis,
        model,
        renavam,
        year,
      });

      res.status(200).json(updatedVehicle);

      Logger.save('update() success');
    } catch (error) {
      Logger.save('update() fail');

      next(error);
    }
  };

  public delete: RequestHandler = async (req, res, next) => {
    try {
      await this._service.delete(req.params.id);

      res.status(204).end();

      Logger.save('delete() success');
    } catch (error) {
      Logger.save('delete() fail');

      next(error);
    }
  };
}
