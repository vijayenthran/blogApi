'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {animal} = require('./Models/animalmodel');

router.get('/', (req, res)=> {
    animal.find({}).then(docs =>{
        res.status(200).json(docs);
    }).catch(err =>{
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res)=> {
    const reqField= ['name','breed' ,'content', 'author'];
    for(let i=0; i<reqField.length; i++){
        if(!(reqField[i] in req.body)) {
            const message = `${reqField[i]} parameter is missing in the request body`;
            console.error(message);
            res.status(400).end();
            return;
        }
    }
    let createObj = {
        name: req.body.name,
        breed:req.body.breed,
        content: req.body.content,
        author: {firstName:req.body.author.firstName,lastName:req.body.author.lastName},
    };
    animal.create(createObj)
        .then(() => {
            res.status(201).json(createObj);
        }).catch(err => {
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.delete('/:id', (req, res)=> {
    const id = req.params.id;
    animal.remove({_id :`${id}`}).then(() => {
        console.info(`[INFO] -- Deleted document of the follwoing id ${id}`);
        res.status(204).end();
    }).catch(err => {
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/:id', jsonParser, (req, res)=> {
    const _id = req.params.id;
    const reqField= ['name','breed' ,'content', 'author'];
    for(let i=0; i<reqField.length; i++){
        if(!(reqField[i] in req.body)) {
            const message = `${reqField[i]} parameter is missing in the request body`;
            console.error(message);
            res.status(400).end();
            return;
        }
    }
    let createObj = {
        name: req.body.name,
        breed:req.body.breed,
        content: req.body.content,
        author: {firstName:req.body.author.firstName,lastName:req.body.author.lastName},
    };
    animal.updateOne(
        {_id: id},
        createObj
    ).then(() => {
        res.status(201).send(createObj);
    }).catch(err => {
        console.error(`[ERROR] --- ${err}`);
        res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = router;