/**
 * Created by halvor on 11.06.2016.
 */

var collect = function(cb){

  var request = require('request');
  request(sails.config.daikin.host + '/aircon/get_sensor_info', function (err, response, body) {
    if (err)
      return cb(err);

    if (!body.length){
      return cb(null);
    }

    var csv = require('csv');
    csv.parse(body, function(err, data){
        if (err)
          return cb(err);

      var tmp, obj = {};
      for (var i=0; i<data[0].length; i++){
        tmp = data[0][i].split('=');
        obj[tmp[0]] = tmp[1];
      }

      if (obj.err > 0 || obj.ret != 'OK'){
        return cb(new Error(obj.ret, obj.err));
      }

      Sensor.create({
        indoorTemp: obj.htemp,
        outdoorTemp: obj.otemp,
        frequency: obj.cmpfreq
      }).exec(function(err, sensor){
        if (err)
          return cb(err);
        else
          return cb(null, sensor);
      });
    });
  });

};

var collectContinous = function(){

  collect(function(err, res){

    if (err)
      console.log('err', err);

    // PlotService.uploadSensor(res, function(err, plot){
    //   if (err)
    //     console.log('err', err);
    //   else
    //     console.log('plot updated with', res);
    // });

    setTimeout(collectContinous, 60000); // 60 sec
  });

};

module.exports = {
  collect: collect,
  collectContinous: collectContinous
};
