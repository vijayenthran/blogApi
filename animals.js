const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./model');

BlogPosts.create('Dog', 'Dog is a good friend', 'User1');
BlogPosts.create('Cat', 'Be careful with cats', 'User2');

router.get('/', (req, res)=> {
    res.status(200).json(BlogPosts.get())
});

router.post('/', jsonParser, (req, res)=> {
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

router.delete('/:id', (req, res)=> {
    const id = req.params.id;
    BlogPosts.delete(id);
    console.log(`deleted Blog Post of ${id}`);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res)=> {
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

module.exports = router;