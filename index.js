'use strict';

var express = require('express');
var serveStatic = require('serve-static');
var Yelp = require('yelp');
var yelpParse = require('./yelp-response-parse');
var Dodge = require('dodge');
var merge = require('./merge-results');
var fourParse = require('./four-square-response-parse');
var bodyParser = require('body-parser');
var opener = require('opener');


var WWWApp = express();
WWWApp.use(serveStatic(__dirname));
WWWApp.use(bodyParser.json());
WWWApp.use(bodyParser.urlencoded({
    extended: true
}));

/*Yelp */
var yelp = new Yelp({
    consumer_key: 'hyIQVkkGLREDsZobyPp5dQ',
    consumer_secret: 'UgKdpO46BHlEOT-3K3MIPilF-Ro',
    token: 'PCPmAjNSEpcZ4T7TFaQ3VKj8-nhhRhWJ',
    token_secret: 'uF-cSlKj9usvzCIjSeVzwR2OcS8'
});

/*Foursquare */
var fourSquare = new Dodge({
    clientId: 'ZCSSJ4CTPTIEJW1WZF5EFULND3AFDN0F1CCADUDCL1LOSOKH',
    clientSecret: 'HTFRZCV0PBU4V3WWF3CNHTO1WSJFM1SU2PROFISZOPX1KVTV'
});

function getFourSquare(term, location, callBack) {
    fourSquare.venues.search({near: location, query: term}, function (err, venues) {
        if (err) {
            return callBack(err);
        }
        console.log('venues',venues);
        return callBack(null, fourParse(venues));
    });
}

function getYelpData(term, location, callBack) {
    yelp.search({term: term, location: location})
        .then(function (data) {
            return callBack(null, yelpParse(data));
        }).catch(function (cause) {
        return callBack(cause);
    });
}


function getData(term, location, callBack) {
    var gotError = false;
    var firstData = null;

    getYelpData(term, location, function (err, data) {
        if (err) {
            if (gotError) {
                return callBack(err);
            } else {
                gotError = true;
                firstData = [];
            }
        } else {
            if (firstData) {
                return callBack(null, merge(data, firstData));
            } else {
                firstData = data;
            }
        }
    });

    getFourSquare(term, location, function (err, data) {
        if (err) {
            if (gotError) {
                return callBack(err);
            } else {
                gotError = true;
                firstData = [];
            }
        } else {
            if (firstData) {
                return callBack(null, merge(firstData, data));
            } else {
                firstData = data;
            }
        }
    });
}


WWWApp.get('/search', function (req, res) {
    var query = req.query.term,
        location = req.query.location;
    if (query && location) {
        return getData(query, location, function (err, data) {
            if (err) {
                return res.send(JSON.stringify({err: true, code: err}));
            }
            return res.send(JSON.stringify(data));
        });
    } else {
        return res.send(JSON.stringify({err: true, code: 'INVALID_REQUEST'}));
    }
});

WWWApp.listen(3003, function () {
    opener('http://localhost:3003');
});