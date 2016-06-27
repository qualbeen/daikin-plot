/**
 * PlotController
 *
 * @description :: Server-side logic for managing plots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res){

    Sensor.find().sort({'createdAt': 'desc'}).limit(1).exec(function(err, result){

      var params = {
        sensor: result[0],
        assets: {
        js: [
          'https://code.jquery.com/jquery-3.0.0.min.js',
          'https://cdn.plot.ly/plotly-latest.min.js'
        ]
      }
    };

      return res.view(null, params);

    });
  },

  upload: function(req, res){

    PlotService.uploadAll(function(err, data){

      console.log(data);
      res.send(data);

    });

  }
};

