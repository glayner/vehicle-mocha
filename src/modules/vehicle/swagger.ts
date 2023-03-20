const helperVehicleDocExample = {
  id: '529b35e9-49e5-40d3-8049-e87ad386caf5',
  plate: 'ABC-1236',
  chassis: '9BGKS84R0FG390321',
  renavam: '12345678901',
  model: 'Gol',
  brand: 'Volkswagen',
  year: '2018',
  updatedAt: '2023-03-20T14:43:58.369Z',
  createdAt: '2023-03-20T14:43:58.369Z',
};
const helperVehicleDocProps = {
  idParam: {
    name: 'id',
    in: 'path',
    description: 'uuid',
    required: true,
    style: 'simple',
    schema: {
      type: 'string',
    },
  },
  requestBody: {
    plate: { type: 'string' },
    chassis: { type: 'string' },
    renavam: { type: 'string' },
    model: { type: 'string' },
    brand: { type: 'string' },
    year: { type: 'string' },
  },
};
const helperVehicleDocResponse = {
  success: {
    single: {
      '200': {
        description: 'success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/vehicle',
            },
            example: helperVehicleDocExample,
          },
        },
      },
    },
    multiple: {
      '200': {
        description: 'success',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/vehicle',
              },
            },
            example: [helperVehicleDocExample],
          },
        },
      },
    },
  },
  error: {
    conflict: {
      '409': {
        description: 'Error: Conflict',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
            example: {
              error: {
                message: 'Vehicle renavam already exists',
              },
            },
          },
        },
      },
    },
    notFount: {
      '404': {
        description: 'Error: Not Found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
            example: {
              error: {
                message: 'Vehicle not found',
              },
            },
          },
        },
      },
    },
    validation: {
      id: {
        '400': {
          description: 'Error: Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error',
              },
              example: {
                error: {
                  message: '"id" must be a valid GUID',
                },
              },
            },
          },
        },
      },
      body: {
        '400': {
          description: 'Error: Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error',
              },
              example: {
                error: {
                  message: '"plate" must be a string',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const pathsVehicleDoc = {
  '/vehicle': {
    get: {
      tags: ['VEHICLES'],
      summary: 'list all vehicles',
      description: 'Lista todos os veículos cadastrados.',
      operationId: 'listallvehicles',
      parameters: [],
      responses: {
        ...helperVehicleDocResponse.success.multiple,
      },
      deprecated: false,
    },
    post: {
      tags: ['VEHICLES'],
      summary: 'create new vehicle',
      description: 'cadastra um novo veículo.',
      operationId: 'createNewVehicle',
      parameters: [],
      requestBody: {
        description: '',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/createVehicle',
            },
          },
        },
      },
      responses: {
        ...helperVehicleDocResponse.success.single,
        ...helperVehicleDocResponse.error.conflict,
        ...helperVehicleDocResponse.error.validation.body,
      },
      deprecated: false,
    },
  },
  '/vehicle/{id}': {
    get: {
      tags: ['VEHICLES'],
      summary: 'find vehicle by id',
      description: 'Busca veículo pelo id',
      operationId: 'findVehicleById',
      parameters: [helperVehicleDocProps.idParam],
      responses: {
        ...helperVehicleDocResponse.success.single,
        ...helperVehicleDocResponse.error.notFount,
        ...helperVehicleDocResponse.error.validation.id,
      },
    },
    put: {
      tags: ['VEHICLES'],
      summary: 'update vehicle by id',
      description: 'Atualiza cadastro do veículo pelo id',
      operationId: 'updateVehicleById',
      parameters: [helperVehicleDocProps.idParam],
      requestBody: {
        description: '',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/updateVehicle',
            },
          },
        },
      },
      responses: {
        ...helperVehicleDocResponse.success.single,
        ...helperVehicleDocResponse.error.conflict,
        ...helperVehicleDocResponse.error.validation.id,
        '400.1': helperVehicleDocResponse.error.validation.body[400],
        ...helperVehicleDocResponse.error.notFount,
      },
    },
    delete: {
      tags: ['VEHICLES'],
      summary: 'delete vehicle by id',
      description: 'Exclui veículo pelo id',
      operationId: 'deleteVehicleById',
      parameters: [helperVehicleDocProps.idParam],
      responses: {
        '204': {
          description: 'success',
        },
        ...helperVehicleDocResponse.error.notFount,
        ...helperVehicleDocResponse.error.validation.id,
      },
    },
  },
};

export const componentsVehicleDoc = {
  vehicle: {
    title: 'vehicle',
    type: 'object',
    properties: {
      id: { type: 'string' },
      ...helperVehicleDocProps.requestBody,
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
  },
  createVehicle: {
    title: 'createVehicle',
    required: ['plate', 'chassis', 'renavam', 'model', 'brand', 'year'],
    type: 'object',
    properties: helperVehicleDocProps.requestBody,
  },
  updateVehicle: {
    title: 'updateVehicle',
    type: 'object',
    properties: helperVehicleDocProps.requestBody,
  },
  error: {
    title: 'error',
    type: 'object',
    properties: {
      error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const tagsVehicleDoc = [
  {
    name: 'VEHICLES',
    description: 'gerenciamento do cadastro de veículos',
  },
];
