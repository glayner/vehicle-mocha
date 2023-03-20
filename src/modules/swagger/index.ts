import {
  componentsVehicleDoc,
  pathsVehicleDoc,
  tagsVehicleDoc,
} from '../vehicle/swagger';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API-VEHICLE-MOCHA',
    description: '## Sistema de crud de veículos para teste na Info Técnologia',
    contact: {},
    version: '1.0',
  },
  servers: [
    {
      url: '/',
      variables: {},
    },
  ],
  paths: {
    ...pathsVehicleDoc,
  },
  components: {
    schemas: {
      ...componentsVehicleDoc,
    },
  },
  tags: [...tagsVehicleDoc],
};
