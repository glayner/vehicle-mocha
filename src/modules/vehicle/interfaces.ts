type Replace<T, R> = Omit<T, keyof R> & R;

export interface IVehicle extends IVehicleCreateRequest {
  id: string;
  updatedAt: Date | null;
  createdAt: Date;
}

export interface IVehicleCreateRequest {
  plate: string;
  chassis: string;
  renavam: string;
  model: string;
  brand: string;
  year: string;
}

export interface IVehicleGetUniqueRequest {
  plate?: string;
  chassis?: string;
  renavam?: string;
  id?: string;
}

export type IVehicleUpdateRequest = Partial<IVehicleCreateRequest>;

export type IVehicleMockResponse = Replace<
  IVehicle,
  { createdAt: string; updatedAt: string | null }
>;
