import { Router } from 'express';
import VehicleController from './controller';
import VehicleMiddlewares from './middlewares';

export default class VehicleRouter {
  private _router: Router;

  private _controller: VehicleController;

  constructor(router = Router(), controller = new VehicleController()) {
    this._router = router;
    this._controller = controller;

    this._router.get('/', this._controller.getAll);
    this._router.get(
      '/:id',
      VehicleMiddlewares.idVehicleValidation,
      this._controller.getById,
    );
    this._router.post(
      '/',
      VehicleMiddlewares.createValidation,
      this._controller.create,
    );
    this._router.put(
      '/:id',
      VehicleMiddlewares.idVehicleValidation,
      VehicleMiddlewares.updateValidation,
      this._controller.update,
    );
    this._router.delete(
      '/:id',
      VehicleMiddlewares.idVehicleValidation,
      this._controller.delete,
    );
  }

  get router() {
    return this._router;
  }
}
