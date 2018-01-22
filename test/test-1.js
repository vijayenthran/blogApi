const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const chai = require('chai');

const {app, startServer, stopServer} = require('../server');

chai.use(chaiHttp);

describe('blog-posts', function() {

    before(function() {
        return startServer();
    });

    after(function() {
        return stopServer();
    });

    it('should list items on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');

                // because we create three items on app load
                expect(res.body.length).to.be.at.least(1);
                // each item should be an object with key/value pairs
                // for `id`, `name` and `checked`.
                const expectedKeys = ['title', 'content', 'author'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });


    it('should add an item on POST', function() {
        const newItem = {title: 'coffee', content: 'Caffine helps us to stay awake', author:'Vijay'};
        return chai.request(app)
            .post('/blog-posts')
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('title', 'content', 'author');
                expect(res.body.id).to.not.equal(null);
                // response should be deep equal to `newItem` from above if we assign
                // `id` to it from `res.body.id`
                expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}, {publishDate:res.body.publishDate}));
            });
    });


    it('should update items on PUT', function() {
        let updateData = {title: 'coffee', content: 'Caffine helps us to stay awake, Its good in mornings', author:'Vijay'};
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                for(let i=0 ; i<res.body.length; i++){
                    if(res.body[i].title === updateData.title){
                        updateData.id = res.body[i].id;
                    }
                }
                return updateData;
            }).then(function(updateData){
                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
            });
    });

    it('should delete items on DELETE', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });
});
