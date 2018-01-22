const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./model');
// let gameBlog = require('./games');
let animalBlog = require('./animals');
BlogPosts.create('AssasinCreed', 'AssasinCreedDescription', 'User3');
BlogPosts.create('TombRaider', 'TombRaiderdescription', 'User4');

app.use('/blog-posts/animal', animalBlog);

app.get('/blog-posts', (req, res)=> {
   res.status(200).json(BlogPosts.get())
});

app.post('/blog-posts', jsonParser, (req, res)=> {
    const reqField= ['title', 'content', 'author'];
    for(let i=0; i<reqField.length; i++){
        if(!(reqField[i] in req.body)) {
            const message = `${reqField[i]} parameter is missing in the request body`;
            console.error(message);
            res.status(400).end();
            return;
        }
    }
    const blogpPost = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(blogpPost);
});

app.delete('/blog-posts/:id', (req, res)=> {
    const id = req.params.id;
    BlogPosts.delete(id);
    console.log(`deleted Blog Post of ${id}`);
    res.status(204).end();
});

app.put('/blog-posts/:id', jsonParser, (req, res)=> {
    const _id = req.params.id;
    const reqField= ['title', 'content', 'author'];
    for(let i=0; i<reqField.length; i++){
        if(!(reqField[i] in req.body)) {
            const message = `${reqField[i]} parameter is missing in the request body`;
            console.error(message);
            res.status(400).end();
            return;
        }
    }
    const blogpPost = BlogPosts.update({
        id: _id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
    });
    res.status(201).send(blogpPost);
});

let server;

function startServer(){
    return new Promise(function(resolve, reject){
        let port=3000;
        server = app.listen(port, ()=>{
            console.log('App started and Listening on Port 3000');
            resolve(server);
        }).on('error', err=>{
            reject(err);
        })
    });
}

function stopServer(){
    console.log('I am the server');
    return new Promise(function(resolve, reject){
        server.close(err=>{
            if(err){
                reject(err);
                return;
            }
            resolve();
        })
    });
}

if (require.main === module) {
    startServer().catch(err => console.error(err));
}

module.exports = {app, startServer, stopServer};