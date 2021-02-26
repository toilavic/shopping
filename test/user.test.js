const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const server = require('../serverTest');
// const apiAddress = "https://stormy-meadow-11036.herokuapp.com/";
const apiAddress = "http://localhost:5000/";

process.env.NODE_ENV = 'test';

createTestUser = () => {
  return chai
    .request(apiAddress)
    .post('/users')
    .set('Content-Type', 'application/json')
    .send({
      username: 'test123',
      name: 'test123',
      password: 'test123'
    });
};

describe('Demonstration of tests', function() {
  before(async function () {
    // start the server
    server.start();
  });

  after(function () {
    // close the server
    server.close();
  })

  describe('Testing route REGISTER', async function() {
    it('Should return status 200 with correct request', async function() {
      createTestUser()
        .then(response => {
          expect(response.status).to.equal(200);
        })
        .catch(error => {
          throw error
        });
    })

    it('Should return status 400 with missing required information or expected "username" to be unique', async function() {
      await chai.request(apiAddress)
        .post('/users')
        .send({
          username: 'test123',
          password: 'test123'
        })
        .then(response => {
          expect(response.status).to.equal(400);
        })
        .catch(error => {
          throw error
        });
    })
  })

  describe('User login test', function() {
    it('should return status 200 and token', async function() {
      await chai.request(apiAddress)
        .post('/login')
        .send({
          username: "test123",
          password: "test123"
        })
        .then(response => {
          expect(response.status).to.equal(200);
        })
        .catch(error => {
          throw error
        });

      await chai.request(apiAddress)
        .post('/login')
        .send({
          username: "test123",
          password: "test1234"
        })
        .then(response => {
          expect(response.status).to.equal(401);
        })
        .catch(error => {
          throw error
        });
    });
  })
})