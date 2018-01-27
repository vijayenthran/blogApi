'use strict';

const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {port, databaseUrl} = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {general} = require('./Models/generalmodel');
let animalBlog = require('./animals');

app.use('/blog-posts/animals', animalBlog);

app.get('/blog-posts', (req, res)=> {
    general.find({}).then(docs =>{
        res.status(200).json(docs);
    }).catch(err =>{
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.post('/blog-posts', jsonParser, (req, res) => {
    console.log('blog post is being called');
    const reqField = ['title', 'content', 'author'];
    for (let i = 0; i < reqField.length; i++) {
        if (!(reqField[i] in req.body)) {
            const message = `${reqField[i]} parameter is missing in the request body`;
            console.error(message);
            res.status(400).end();
            return;
        }
    }
    let createObj = {
        title: req.body.title,
        content: req.body.content,
        author: {firstName:req.body.author.firstName,lastName:req.body.author.lastName},
    };
    general.create(createObj)
        .then(() => {
            res.status(201).json(createObj);
        }).catch(err => {
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.delete('/blog-posts/:id', (req, res)=> {
    const id = req.params.id;
    general.remove({_id :`${id}`}).then(() => {
        console.info(`[INFO] -- Deleted document of the follwoing id ${id}`);
        res.status(204).end();
    }).catch(err => {
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.put('/blog-posts/:id', jsonParser, (req, res)=> {
    const id = req.params.id;
    const reqField= ['title', 'content', 'author'];
    for(let i=0; i<reqField.length; i++){
        if(!(reqField[i] in req.body)) {
            const message = `${reqField[i]} parameter is missing in the request body`;
            console.error(message);
            res.status(400).end();
            return;
        }
    }
    let createObj = {
        title: req.body.title,
        content: req.body.content,
        author: {firstName:req.body.author.firstName,lastName:req.body.author.lastName},
    };
    general.updateOne(
        {_id: id},
        createObj
    ).then(() => {
            res.status(201).send(createObj);
        }).catch(err => {
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });

});

let server;

function startServer(db) {
    let dtbase;
    if (!db) {
        dtbase = databaseUrl;
    }
    return mongoose.connect(dtbase || db)
        .then(() => {
            console.info(`[INFO] --- Database Connection Successful`);
            return new Promise((resolve, reject) => {
                server = app.listen(port, () => {
                    console.log(`Server Started and listening on port ${port}`);
                    resolve();
                    return;
                }).on('error', err => {
                    reject(err);
                })
            })
        }).catch(err => {
            console.log(`An error has been Occured in Starting the Server`);
            throw err;
        })
}

function stopServer() {
    return mongoose.disconnect().then(() => {
    }).then(() => {
        return new Promise(function (resolve, reject) {
            server.close(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        });
    });
}

if (require.main === module) {
    startServer().catch(err => console.error(err));
}

module.exports = {app, startServer, stopServer};