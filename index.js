const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const FairiesRepository = require('./repository');
const FairiesController = require('./controller');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const config = JSON.parse(fs.readFileSync('./config.json').toString());

const controller = new FairiesController(new FairiesRepository());

app.post('/fairies/:id', (req, res) => {
    controller.createFairy(req.params.id, req.body);
    res.status(201).send('Fairy created successfully !');
});

app.put('/fairies/:id', (req, res) => {
    controller.updateFairy(req.params.id, req.body);
    res.status(200).send('Fairy updated successfully !');
});

app.delete('/fairies/:id', (req, res) => {
    controller.deleteFairy(req.params.id);
    res.status(200).send('Fairy deleted successfully !');
});

app.get('/fairies/:id', (req, res) => {
    const fairy = controller.getFairy(req.params.id);
    res.status(200).send(fairy);
});

app.get('/fairies/_getByIds', (req, res) => {
    const fairies = controller.getFairiesByIds(req.body);
    res.status(200).send(fairies);
});

app.get('/fairies', (req, res) => {
    const fairies = controller.getAllFairies(req.body);
    res.status(200).send(fairies);
});

app.listen(config.port, () => console.log(`app is listening on port ${config.port}`));

