import { randomUUID } from 'crypto';
import {
  IVehicle,
  IVehicleMockResponse,
} from '../../src/modules/vehicle/interfaces';

const now = new Date();

const gol: IVehicle = {
  id: randomUUID(),
  plate: 'ABC-1231',
  chassis: '9BWXH1810DE409725',
  renavam: '12345678901',
  model: 'Gol',
  brand: 'Volkswagen',
  year: '2018',
  updatedAt: null,
  createdAt: now,
};

const golResponse: IVehicleMockResponse = {
  id: gol.id,
  plate: gol.plate,
  chassis: gol.chassis,
  renavam: gol.renavam,
  model: gol.model,
  brand: gol.brand,
  year: gol.year,
  updatedAt: null,
  createdAt: gol.createdAt.toISOString(),
};

const corola: IVehicle = {
  id: randomUUID(),
  plate: 'DEF-4562',
  chassis: '3N1BC1CP3BL527514',
  renavam: '23456789012',
  model: 'Corolla',
  brand: 'Toyota',
  year: '2020',
  updatedAt: null,
  createdAt: now,
};

const corolaResponse: IVehicleMockResponse = {
  id: corola.id,
  plate: corola.plate,
  chassis: corola.chassis,
  renavam: corola.renavam,
  model: corola.model,
  brand: corola.brand,
  year: corola.year,
  updatedAt: null,
  createdAt: corola.createdAt.toISOString(),
};

const corolaExist: IVehicle = {
  id: randomUUID(),
  plate: corola.plate,
  chassis: corola.chassis,
  renavam: corola.renavam,
  model: corola.model,
  brand: corola.brand,
  year: corola.year,
  updatedAt: null,
  createdAt: corola.createdAt,
};

const corolaExistResponse: IVehicleMockResponse = {
  id: corolaExist.id,
  plate: corolaExist.plate,
  chassis: corolaExist.chassis,
  renavam: corolaExist.renavam,
  model: corolaExist.model,
  brand: corolaExist.brand,
  year: corolaExist.year,
  updatedAt: null,
  createdAt: corolaExist.createdAt.toISOString(),
};

const updatedCorola: IVehicle = {
  id: corola.id,
  plate: 'JKL-0123',
  chassis: corola.chassis,
  renavam: corola.renavam,
  model: corola.model,
  brand: corola.brand,
  year: '2021',
  updatedAt: now,
  createdAt: corola.createdAt,
};

const updatedCorolaResponse: IVehicleMockResponse = {
  id: updatedCorola.id,
  plate: updatedCorola.plate,
  chassis: updatedCorola.chassis,
  renavam: updatedCorola.renavam,
  model: updatedCorola.model,
  brand: updatedCorola.brand,
  year: updatedCorola.year,
  updatedAt: now.toISOString(),
  createdAt: updatedCorola.createdAt.toISOString(),
};

const jeep: IVehicle = {
  id: randomUUID(),
  plate: 'GHI-7894',
  chassis: '1C3CCBCG6DN609026',
  renavam: '34567890123',
  model: 'Compass',
  brand: 'Jeep',
  year: '2022',
  updatedAt: null,
  createdAt: now,
};

const jeepResponse: IVehicleMockResponse = {
  id: jeep.id,
  plate: jeep.plate,
  chassis: jeep.chassis,
  renavam: jeep.renavam,
  model: jeep.model,
  brand: jeep.brand,
  year: jeep.year,
  updatedAt: null,
  createdAt: jeep.createdAt.toISOString(),
};

const saab: IVehicle = {
  id: randomUUID(),
  plate: 'MNO-3455',
  chassis: 'YS3EH55G623013408',
  renavam: '56789012345',
  model: '9-3',
  brand: 'Saab',
  year: '2006',
  updatedAt: null,
  createdAt: now,
};

const saabResponse: IVehicleMockResponse = {
  id: saab.id,
  plate: saab.plate,
  chassis: saab.chassis,
  renavam: saab.renavam,
  model: saab.model,
  brand: saab.brand,
  year: saab.year,
  updatedAt: null,
  createdAt: saab.createdAt.toISOString(),
};

export const idNotFound = randomUUID();

export const get = {
  mock: [gol, corola, jeep, saab],
  response: [golResponse, corolaResponse, jeepResponse, saabResponse],
};

export const getId = {
  mock: jeep,
  response: jeepResponse,
};

export const post = {
  mock: saab,
  request: {
    plate: saab.plate,
    chassis: saab.chassis,
    renavam: saab.renavam,
    model: saab.model,
    brand: saab.brand,
    year: saab.year,
  },
  response: saabResponse,
};

export const put = {
  getByIdMock: corola,
  mock: updatedCorola,
  request: {
    plate: updatedCorola.plate,
    year: updatedCorola.year,
  },
  response: updatedCorolaResponse,
  exist: corolaExist,
  existResponse: corolaExistResponse,
};

export const _delete = {
  mock: gol,
};
