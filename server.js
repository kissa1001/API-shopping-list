var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var _ = require('underscore');

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

app.delete('/items/:id', function(request, response) {
    var itemId = parseInt(request.params.id);
    _.each(storage.items, function(item){
    	if(item.id == itemId){
    		response.status(201).json(item);
    		storage.items.splice(itemId, 1);
    		return response;
    	}
    	return response.sendStatus(404);
    });
});

app.put('/items/:id', jsonParser, function(request, response) {
    var itemId = parseInt(request.params.id);
    _.each(storage.items, function(item){
    	if(item.id == itemId){
    		item.name = request.body.name;
    		response.status(201).json(item);
    		return response;
    	}
    });

    storage.items.add(item.name);
    response.status(201).end();
});
app.listen(process.env.PORT || 8080);