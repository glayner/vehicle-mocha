import { RequestHandler } from 'express';
import joi from 'joi';
import { BadRequest } from '../../shared/utils/errors/BadRequest';
import { IVehicleCreateRequest, IVehicleUpdateRequest } from './interfaces';

export default class VehicleMiddlewares {
  private static _createSchema = joi.object({
    plate: joi
      .string()
      .regex(/^([A-Z]{3}-\d{4})$/, 'Invalid license plate number')
      .required(),
    brand: joi.string().required(),
    chassis: joi
      .string()
      .regex(/^([A-HJ-NPR-Z\d]{17})$/, 'Invalid chassis number')
      .required(),
    model: joi.string().required(),
    renavam: joi
      .string()
      .regex(/^(\d{11})$/, 'Invalid renavam number')
      .required(),
    year: joi
      .string()
      .regex(/^(\d{4})$/, 'Invalid year')
      .required(),
  });

  private static _updateSchema = joi.object({
    plate: joi
      .string()
      .regex(/^([A-Z]{3}-\d{4})$/, 'Invalid license plate number'),
    brand: joi.string(),
    chassis: joi
      .string()
      .regex(/^([A-HJ-NPR-Z\d]{17})$/, 'Invalid chassis number'),
    model: joi.string(),
    renavam: joi.string().regex(/^(\d{11})$/, 'Invalid renavam number'),
    year: joi.string().regex(/^(\d{4})$/, 'Invalid year'),
  });

  private static _vehicleIdSchema = joi.object({
    id: joi.string().uuid().required(),
  });

  public static createValidation: RequestHandler = (req, _res, next) => {
    const { plate, brand, chassis, model, renavam, year } =
      req.body as IVehicleCreateRequest;

    const { error } = VehicleMiddlewares._createSchema.validate({
      plate,
      brand,
      chassis,
      model,
      renavam,
      year,
    });

    if (error) return next(new BadRequest(error.message));

    next();
  };

  public static updateValidation: RequestHandler = (req, _res, next) => {
    const { plate, brand, chassis, model, renavam, year } =
      req.body as IVehicleUpdateRequest;

    const { error } = VehicleMiddlewares._updateSchema.validate({
      plate,
      brand,
      chassis,
      model,
      renavam,
      year,
    });

    if (error) return next(new BadRequest(error.message));

    next();
  };

  public static idVehicleValidation: RequestHandler = (req, _res, next) => {
    const { id } = req.params;

    const { error } = VehicleMiddlewares._vehicleIdSchema.validate({ id });

    if (error) return next(new BadRequest(error.message));

    next();
  };
}
