/**
 * Created by halvor on 11.06.2016.
 */

var findAll = function(cb) {

  Sensor.find({}).sort({createdAt: 'desc'}).limit(3600).exec(function (err, data) {

    if (err)
      return cb(err);


    var createdAt = [], indoorTmp = [], outdoorTmp = [], frequency = [];

    for (var i = data.length - 1; i >= 0; i--) {
      createdAt.push(new Date(data[i].createdAt));
      indoorTmp.push(data[i].indoorTemp);
      outdoorTmp.push(data[i].outdoorTemp);
      frequency.push(data[i].frequency);
    }

    var graph = [{
      x: createdAt,
      y: outdoorTmp,
      name: 'Outdoor'
    }, {
      x: createdAt,
      y: indoorTmp,
      name: 'Indoor'
    }, {
      x: createdAt,
      y: frequency,
      name: 'Frequency'
    }];

    return cb(null, graph);

  });
};

var uploadAll = function(cb){

  findAll(function(err, graph){

    return plot(graph, false, cb);

  });
};

/**
 * 'Request throttled. You\'ve created/updated more charts than your allowed limit of 50/day.
 * 'You may either wait one day or upgrade your account. Visit https://plot.ly/settings/subscription/ to upgrade.
 *
 * @param sensor
 * @param cb
 */
var uploadSensor = function (sensor, cb) {

  var graph = [{
    x: [sensor.createdAt],
    y: [sensor.outdoorTemp],
    name: 'Outdoor'
  }, {
    x: [sensor.createdAt],
    y: [sensor.indoorTemp],
    name: 'Indoor'
  }, {
    x: [sensor.createdAt],
    y: [sensor.frequency],
    name: 'Frequency'
  }];

  return plot(graph, true, cb);
};


var plot = function(graph, extend, cb){

  var plotly = require('plotly')('qualbeen','zim4g6jggl');
  // var data = [{x:[], y:[], stream:{token:'yourStreamtoken', maxpoints:200}}];

  var graphOptions = {
    fileopt : extend ? "extend" : "overwrite",
    filename : "daikin-plot",
    style: [{type: "line"}, {type: "line"}, {type: "bar"}]
  };

  plotly.plot(graph, graphOptions, function(err, result) {

    if (err)
      return cb(err);

    return cb(null, result);

  });

};

var convertToPlot = function (objects) {

  var createdAt = [], indoorTmp = [], outdoorTmp = [], frequency = [];

  for (var i = objects.length - 1; i >= 0; i--) {
    createdAt.push(new Date(objects[i].createdAt));
    indoorTmp.push(objects[i].indoorTemp);
    outdoorTmp.push(objects[i].outdoorTemp);
    frequency.push(objects[i].frequency > 0 ? objects[i].frequency / 2 : null);
  }

  return [{
    x: createdAt,
    y: outdoorTmp,
    name: 'Outdoor',
    type: 'scatter',
    mode: 'line'
  }, {
    x: createdAt,
    y: indoorTmp,
    name: 'Indoor',
    type: 'scatter',
    mode: 'line'
  }, {
    x: createdAt,
    y: frequency,
    name: 'Frequency',
    type: 'scatter',
    mode: 'markers'
  }];
};

module.exports = {
  findAll: findAll,
  uploadAll: uploadAll,
  uploadSensor: uploadSensor,
  convertToPlot: convertToPlot,

};
