const mocha = require('mocha'),
      chai = require('chai'),
      chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;
const agent = chai.request.agent('http://localhost:8080');

let sessionId;

describe('Black box API testing', () => {

    it('should get nothing from /v1/albums.json', (done) => {
        agent
            .get('/v1/albums.json')
            .end((err, res) => {
                // sessionId = res.headers['set-cookie'].pop().split(';')[0];

                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.error).to.be.null;
                expect(res.body.data.albums).to.be.an('array');
                expect(res.body.data.albums).to.be.empty;

                done();
            });
    });

    it.skip('should fail to add an album using /v1/albums.json', (done) => {
        agent
            .put('/v1/albums.json')
            .send({
                name: 'testing2017',
                date: '2017-01-01',
                title: 'Test Album',
                description: 'Hello, there'
            })
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
    });

    it.skip('should register a new user', (done) => {
        agent
            .put('/v1/users.json')
            .set('Cookie', sessionId)
            .send({display_name: 'glenp', email_address: 'glen.pinner@example.com', password: 'password'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.ba.an.object;
                expect(res.body.error).to.be.null;
                expect(res.body.data).to.be.an.object;

                const user = res.body.data.user;

                expect(user.display_name).to.be.equal('glenp');
                expect(user.email_address).to.be.equal('glen.pinner@example.com');
                expect(user.password).to.be.undefined;
                done();
            });
    });

    it.skip('should login a user', (done) => {
        agent
            .post('/service/login')
            .set('Cookie', sessionId)
            .send({username: 'glenp', password: 'password'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should add a new album', (done) => {
        agent
            .put('/v1/albums.json')
            .send({
                name: 'testing2017',
                date: '2017-01-01',
                title: 'Test Album',
                description: 'Hello, there'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.error).to.be.null;
                expect(res.body.data).to.be.an.object;

                const album = res.body.data.album;

                expect(album.name).to.be.equal('testing2017');
                expect(album.date).to.be.equal('2017-01-01');
                expect(album.title).to.be.equal('Test Album');
                expect(album.description).to.be.equal('Hello, there');
                done();
            });
    });
});