var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var _ = require('underscore-node');

var Storage = function() {
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
    for (var i = 0 ; i < storage.items.length ; i++) {
        if (storage.items[i].id == itemId) {
            var item = storage.items[i];
            res.status(201).json(itemId);
            storage.items.splice(i, 1);
            return res;
        }
    }

    return response.sendStatus(404);
    // var itemId = parseInt(req.params.id);
    // _.each(storage.items, function(item){
    //     if(item.id == itemId){
    //         res.status(201).json(itemId);
    //         storage.items.splice(item.id, 1);
    //         return res;
    //     }
    // });
    // return res.sendStatus(404);

});

app.put('/items/:id', jsonParser, function(req, res) {
    var itemId = req.params.id;
    for (var i = 0 ; i < storage.items.length ; i++) {
        if (storage.items[i].id == itemId) {
            storage.items[i].name = req.body.name;
            res.status(201).json(storage.items[i]);
            return res;
        }
    }

    return response.sendStatus(404);
    //var itemId = parseInt(req.params.id);
    // _.each(storage.items, function(item){
    //     if(item.id == itemId){
    //         item.name = req.body.name;
    //         res.status(201).json(item);
    //         return res;
    //     }
    // });

    // return res.sendStatus(404);
    });

app.listen(process.env.PORT || 8080);