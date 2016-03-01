var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var _ = require('underscore');

var Storage = function () {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    var itemId = req.params.id;

    // find the item we want to delete
    var item = _.find(storage.items, function(item){
        return item.id == itemId;
    });

    // if the item exists, remove it from the storage
    if (item) {
        storage.items = _.filter(storage.items, function(item){
            return item.id != itemId;
        });
        return res.status(200).json(item);
    } else {
        return res.sendStatus(404);
    }
});

app.put('/items/:id', jsonParser, function(req, res) {
    var itemId = req.params.id;

    var item = _.find(storage.items, function(item) {
        return item.id == itemId;
    });

    if (item) {
        item.name = req.body.name;
        return res.status(200).json(item);
    } else {
        return res.sendStatus(404);
    }

});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;