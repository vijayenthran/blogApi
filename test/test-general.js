const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const chai = require('chai');
const faker = require('faker');
const {app, startServer, stopServer} = require('../server');
const {general} = require('../Models/generalmodel');
const {testdatabaseURl} = require('../config');
chai.use(chaiHttp);
const mongoose = require('mongoose');

function seedRestaurantdata(){
    console.info('seeding restaurant data');
    const seedData = [];
    for (let i=1; i<=10; i++) {
        seedData.push(generateBlogData());
    }
    return general.insertMany(seedData);
}

function generateBlogData(){
    return {
        title : faker.random.word(),
        content:faker.lorem.sentence(),
    author: {firstName:faker.name.firstName(),lastName:faker.name.lastName()},
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('blog-posts', function() {

    beforeEach(function(){
       return seedRestaurantdata();
    });

    afterEach(function(){
        return tearDownDb();
    });

    before(function() {
        return startServer(testdatabaseURl);
    });

    after(function() {
        return stopServer();
    });

    it('should return all existing blog data of general', function() {
        let res;
        return chai.request(app)
            .get('/blog-posts')
            .then(function(_res) {
                res =_res;
                expect(res).to.have.status(200);
                expect(res.body).to.have.length.of.at.least(1);
                return general.count();
            }).then((count)=>{
                expect(res.body).to.have.length.of(count);
            });
    });


    it('Post a blog data', function() {
        let mockdata = generateBlogData();
        return chai.request(app)
            .post('/blog-posts')
            .send(mockdata)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('title', 'content', 'author');
                expect(res.body.id).to.not.equal(null);
                return general.findOne({title : `${mockdata.title}`});
            }).then(data => {
                expect(data.title).to.equal(mockdata.title);
                expect(data.content).to.equal(mockdata.content);
                expect(data.author.firstName).to.equal(mockdata.author.firstName);
                expect(data.author.lastName).to.equal(mockdata.author.lastName);
            })
    });

    it('should update items on PUT', function() {
        let updateData = {title: 'coffee', content: 'Caffine helps us to stay awake, Its good in mornings', author: {firstName:"Vijay",lastName:"Enthran"}};
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                let dataId = res.body[0]._id;
                return chai.request(app)
                    .put(`/blog-posts/${dataId}`)
                    .send(updateData);
            }).then(function(response){
                expect(response.body.title).to.equal(updateData.title);
                expect(response.body.content).to.equal(updateData.content);
                expect(response.body.author.firstName).to.equal(updateData.author.firstName);
                expect(response.body.author.lastName).to.equal(updateData.author.lastName);
                return general.findOne({title : `${updateData.title}`});
            })
            .then(function(response) {
                expect(response.title).to.equal(updateData.title);
                expect(response.content).to.equal(updateData.content);
                expect(response.author.firstName).to.equal(updateData.author.firstName);
                expect(response.author.lastName).to.equal(updateData.author.lastName);
            });
    });

    it('should delete items on DELETE', function() {
        let data;
        return general.findOne().then((res)=>{
           data = res;
           return res;
        }).then(data=>{
            return chai.request(app)
                .delete(`/blog-posts/${data._id}`);
        }).then(res=> {
            expect(res.statusCode).to.equal(204);
            return general.findOne({_id : data._id});
        }).then(data=>{
            expect(data).to.be.null;
        });
        });

});
