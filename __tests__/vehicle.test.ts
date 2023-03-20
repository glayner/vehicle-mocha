import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import VehicleRepository from '../src/modules/vehicle/repository';
import app from '../src/shared/app';
import * as fakeData from './fakeData';
import Logger from '../src/shared/utils/logger';

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /vehicle', () => {
  describe('success case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'getAll')
        .resolves(fakeData.get.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.getAll as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('whould be able to return data with status 200', async () => {
      const { status, body } = await chai.request(app).get('/vehicle');

      expect(status).to.be.equal(200);
      expect(body).to.be.an('array');
      expect(body[0]).to.have.property('id');
      expect(body[0]).to.have.property('plate');
      expect(body[0]).to.have.property('chassis');
      expect(body[0]).to.have.property('renavam');
      expect(body[0]).to.have.property('model');
      expect(body[0]).to.have.property('brand');
      expect(body[0]).to.have.property('year');
      expect(body).to.be.deep.equal(fakeData.get.response);
      expect((Logger.save as sinon.SinonStub).calledWith('getAll() success')).to
        .be.true;
    });
  });

  describe('database fail', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'getAll')
        .throws(new Error('db error'));
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.getAll as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('showld be able to send error mesage with status 500', async () => {
      const { status, body } = await chai.request(app).get('/vehicle');

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('getAll() fail')).to.be
        .true;
    });
  });
});

describe('GET /vehicle/:id', () => {
  describe('exist vheicle case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'getById')
        .resolves(fakeData.getId.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('showld be able to return vehicle with status 200', async () => {
      const { status, body } = await chai
        .request(app)
        .get(`/vehicle/${fakeData.getId.mock.id}`);

      expect(status).to.be.equal(200);
      expect(body).to.be.an('object');
      expect(body).to.be.deep.equal(fakeData.getId.response);
      expect((Logger.save as sinon.SinonStub).calledWith('getById() success'))
        .to.be.true;
    });
  });

  describe('case vehicle non-exists', () => {
    before(() => {
      sinon.stub(VehicleRepository.prototype, 'getById').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should return message error with status 404', async () => {
      const { status, body } = await chai
        .request(app)
        .get(`/vehicle/${fakeData.idNotFound}`);

      expect(status).to.be.equal(404);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('Vehicle not found');
      expect((Logger.save as sinon.SinonStub).calledWith('getById() fail')).to
        .be.true;
    });
  });

  describe('case database error', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'getById')
        .throws(new Error('db error'));
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should be able to return message error with status 500', async () => {
      const { status, body } = await chai
        .request(app)
        .get(`/vehicle/${fakeData.getId.mock.id}`);

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('getById() fail')).to
        .be.true;
    });
  });

  describe('validation error case', () => {
    describe('id', () => {
      it('should be able to return message error with status 400 if send invalid id', async () => {
        const { status, body } = await chai.request(app).get('/vehicle/999');

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"id" must be a valid GUID');
      });
    });
  });
});

describe('POST /vehicle', () => {
  describe('success case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'create')
        .resolves(fakeData.post.mock);
      sinon.stub(VehicleRepository.prototype, 'getUnique').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.create as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getUnique as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should be able to return vehicle created with status 201', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/vehicle')
        .send(fakeData.post.request);

      expect(status).to.be.equal(201);
      expect(body).to.be.an('object');
      expect(body).to.be.deep.equal(fakeData.post.response);
      expect((Logger.save as sinon.SinonStub).calledWith('create() success')).to
        .be.true;
    });
  });

  describe('case unique values already exist', () => {
    before(() => {
      sinon.stub(VehicleRepository.prototype, 'create').resolves();
      sinon
        .stub(VehicleRepository.prototype, 'getUnique')
        .resolves(fakeData.post.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.create as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getUnique as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should be able to return message error with status 409', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/vehicle')
        .send(fakeData.post.request);

      expect(status).to.be.equal(409);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('Vehicle plate already exists');
      expect((Logger.save as sinon.SinonStub).calledWith('create() fail')).to.be
        .true;
    });
  });

  describe('dabase error case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'create')
        .throws(new Error('db error'));
      sinon.stub(VehicleRepository.prototype, 'getUnique').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.create as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getUnique as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('dshould be able to return message error with status 500', async () => {
      const { status, body } = await chai
        .request(app)
        .post('/vehicle')
        .send(fakeData.post.request);

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('create() fail')).to.be
        .true;
    });
  });

  describe('case validation error', () => {
    describe('plate', () => {
      it('should be able to return message error with status 400 if not send plate', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, plate: undefined });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"plate" is required');
      });

      it('should be able to return message error with status 400 if plate isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, plate: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"plate" must be a string');
      });

      it('should be able to return message error with status 400 if plate isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, plate: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"plate" with value "asdf999" fails to match the Invalid license plate number pattern',
        );
      });
    });

    describe('chassis', () => {
      it('should be able to return message error with status 400 if not send chassis', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, chassis: undefined });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"chassis" is required');
      });

      it('should be able to return message error with status 400 if chassis isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, chassis: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"chassis" must be a string');
      });

      it('should be able to return message error with status 400 if chassis isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, chassis: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"chassis" with value "asdf999" fails to match the Invalid chassis number pattern',
        );
      });
    });

    describe('renavam', () => {
      it('should be able to return message error with status 400 if not send renavam', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, renavam: undefined });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"renavam" is required');
      });

      it('should be able to return message error with status 400 if renavam isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, renavam: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"renavam" must be a string');
      });

      it('should be able to return message error with status 400 if renavam isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, renavam: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"renavam" with value "asdf999" fails to match the Invalid renavam number pattern',
        );
      });
    });

    describe('year', () => {
      it('should be able to return message error with status 400 if not send year', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, year: undefined });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"year" is required');
      });

      it('should be able to return message error with status 400 if year isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, year: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"year" must be a string');
      });

      it('should be able to return message error with status 400 if year isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, year: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"year" with value "asdf999" fails to match the Invalid year pattern',
        );
      });
    });

    describe('model', () => {
      it('should be able to return message error with status 400 if not send model', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, model: undefined });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"model" is required');
      });

      it('should be able to return message error with status 400 if model isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, model: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"model" must be a string');
      });
    });

    describe('brand', () => {
      it('should be able to return message error with status 400 if not send brand', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, brand: undefined });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"brand" is required');
      });

      it('should be able to return message error with status 400 if brand isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .post('/vehicle')
          .send({ ...fakeData.post.request, brand: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"brand" must be a string');
      });
    });
  });
});

describe('PUT /vehicle/:id', () => {
  describe('success case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'update')
        .resolves(fakeData.put.mock);
      sinon.stub(VehicleRepository.prototype, 'getUnique').resolves(null);
      sinon
        .stub(VehicleRepository.prototype, 'getById')
        .resolves(fakeData.put.getByIdMock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.update as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getUnique as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should be able to return updated vehicle with status 200', async () => {
      const { status, body } = await chai
        .request(app)
        .put(`/vehicle/${fakeData.put.mock.id}`)
        .send(fakeData.put.request);

      expect(status).to.be.equal(200);
      expect(body).to.be.an('object');
      expect(body).to.be.deep.equal(fakeData.put.response);
      expect((Logger.save as sinon.SinonStub).calledWith('update() success')).to
        .be.true;
    });
  });

  describe('non-exist vehicle case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'update')
        .resolves(fakeData.put.mock);
      sinon.stub(VehicleRepository.prototype, 'getUnique').resolves(null);
      sinon.stub(VehicleRepository.prototype, 'getById').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.update as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getUnique as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('shuld be able to return message error with status 404', async () => {
      const { status, body } = await chai
        .request(app)
        .put(`/vehicle/${fakeData.idNotFound}`)
        .send(fakeData.put.mock);

      expect(status).to.be.equal(404);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('Vehicle not found');
      expect((Logger.save as sinon.SinonStub).calledWith('update() fail')).to.be
        .true;
    });
  });

  describe('already exist vehicle with data case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'update')
        .resolves(fakeData.put.mock);
      sinon
        .stub(VehicleRepository.prototype, 'getUnique')
        .resolves(fakeData.put.exist);
      sinon
        .stub(VehicleRepository.prototype, 'getById')
        .resolves(fakeData.put.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.update as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getUnique as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('shuld be able to return message error with status 409', async () => {
      const { status, body } = await chai
        .request(app)
        .put(`/vehicle/${fakeData.put.mock.id}`)
        .send(fakeData.put.mock);

      expect(status).to.be.equal(409);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('Vehicle chassis already exists');
      expect((Logger.save as sinon.SinonStub).calledWith('update() fail')).to.be
        .true;
    });
  });

  describe('database error case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'update')
        .throws(new Error('db error'));
      sinon.stub(VehicleRepository.prototype, 'getUnique').resolves(null);
      sinon
        .stub(VehicleRepository.prototype, 'getById')
        .resolves(fakeData.put.getByIdMock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.update as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('shuld be able to return message error with status 500', async () => {
      const { status, body } = await chai
        .request(app)
        .put(`/vehicle/${fakeData.put.mock.id}`)
        .send(fakeData.post.request);

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('update() fail')).to.be
        .true;
    });
  });

  describe('validation error case', () => {
    describe('id', () => {
      it('should be able to return message error with status 400 if send invalid id', async () => {
        const { status, body } = await chai
          .request(app)
          .put('/vehicle/999')
          .send(fakeData.post.request);

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"id" must be a valid GUID');
      });
    });

    describe('plate', () => {
      it('should be able to return message error with status 400 if plate isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ plate: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"plate" must be a string');
      });

      it('should be able to return message error with status 400 if plate isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ plate: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"plate" with value "asdf999" fails to match the Invalid license plate number pattern',
        );
      });
    });

    describe('chassis', () => {
      it('should be able to return message error with status 400 if chassis isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ chassis: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"chassis" must be a string');
      });

      it('should be able to return message error with status 400 if chassis isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ chassis: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"chassis" with value "asdf999" fails to match the Invalid chassis number pattern',
        );
      });
    });

    describe('renavam', () => {
      it('should be able to return message error with status 400 if renavam isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ renavam: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"renavam" must be a string');
      });

      it('should be able to return message error with status 400 if renavam isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ renavam: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"renavam" with value "asdf999" fails to match the Invalid renavam number pattern',
        );
      });
    });

    describe('year', () => {
      it('should be able to return message error with status 400 if year isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ year: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"year" must be a string');
      });

      it('should be able to return message error with status 400 if year isnt invalid', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ year: 'asdf999' });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal(
          '"year" with value "asdf999" fails to match the Invalid year pattern',
        );
      });
    });

    describe('model', () => {
      it('should be able to return message error with status 400 if model isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ model: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"model" must be a string');
      });
    });

    describe('brand', () => {
      it('should be able to return message error with status 400 if brand isnt string', async () => {
        const { status, body } = await chai
          .request(app)
          .put(`/vehicle/${fakeData.put.mock.id}`)
          .send({ brand: 999 });

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"brand" must be a string');
      });
    });
  });
});

describe('DELETE /vehicle/:id', () => {
  describe('success case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'delete')
        .resolves(fakeData._delete.mock);
      sinon
        .stub(VehicleRepository.prototype, 'getById')
        .resolves(fakeData._delete.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.delete as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should be able to return nothing with status 204', async () => {
      const { status, body } = await chai
        .request(app)
        .delete(`/vehicle/${fakeData._delete.mock.id}`);

      expect(status).to.be.equal(204);
      expect(body).to.be.deep.equal({});
      expect((Logger.save as sinon.SinonStub).calledWith('delete() success')).to
        .be.true;
    });
  });

  describe('non-exists case', () => {
    before(() => {
      sinon.stub(VehicleRepository.prototype, 'delete').resolves();
      sinon.stub(VehicleRepository.prototype, 'getById').resolves(null);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.delete as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should be able to return message error with status 404', async () => {
      const { status, body } = await chai
        .request(app)
        .delete(`/vehicle/${fakeData.idNotFound}`);

      expect(status).to.be.equal(404);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('Vehicle not found');
      expect((Logger.save as sinon.SinonStub).calledWith('delete() fail')).to.be
        .true;
    });
  });

  describe('database error case', () => {
    before(() => {
      sinon
        .stub(VehicleRepository.prototype, 'delete')
        .throws(new Error('db error'));
      sinon
        .stub(VehicleRepository.prototype, 'getById')
        .resolves(fakeData._delete.mock);
      sinon.stub(Logger, 'save').resolves();
    });

    after(() => {
      (VehicleRepository.prototype.delete as sinon.SinonStub).restore();
      (VehicleRepository.prototype.getById as sinon.SinonStub).restore();
      (Logger.save as sinon.SinonStub).restore();
    });

    it('should be able to return message error with status 500', async () => {
      const { status, body } = await chai
        .request(app)
        .delete(`/vehicle/${fakeData._delete.mock.id}`);

      expect(status).to.be.equal(500);
      expect(body).to.have.property('error');
      expect(body.error.message).to.be.equal('db error');
      expect((Logger.save as sinon.SinonStub).calledWith('delete() fail')).to.be
        .true;
    });
  });

  describe('validation error case', () => {
    describe('id', () => {
      it('should be able to return message error with status 400 if send invalid id', async () => {
        const { status, body } = await chai.request(app).delete('/vehicle/999');

        expect(status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error.message).to.be.equal('"id" must be a valid GUID');
      });
    });
  });
});
