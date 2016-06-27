/**
 * SensorController
 *
 * @description :: Server-side logic for managing sensors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  collect:  function(req, res){

    SensorService.collect(function(err, data){
      console.log(data);
      res.send(data);
    });

  },

  all: function(req, res){

    Sensor.find().sort({'createdAt': 'desc'}).limit(10000).exec(function(err, result){

      res.send( PlotService.convertToPlot(result) );

    });
  },

  processWeeks: function (req, res) {

    Sensor.find().sort({'createdAt': 'asc'}).limit(1).exec(function(err, result){
    // Sensor.find().limit(1).exec(function(err, result){

      if (err) {
        console.log('err', err);
        return res.send("Error: " + err.stringify);
      }

      var moment = require('moment');

      var criteria;
      var firstSensor = result[0];
      var dayStart = moment(firstSensor.createdAt).startOf('isoweek');
      var dayEnd   = moment(dayStart).add(1, 'days');

      var toDay = new Date();
      while (dayStart.isBefore(toDay, 'week')){

        criteria = {
          createdAt: {
            '>=': dayStart.toDate(),
            '<' : dayEnd.toDate()
          }
        };

        dayStart.add(1, 'days');
        dayEnd.add(1, 'days');

        Sensor.find(criteria).sort({'createdAt': 'asc'}).exec(function(err, week){

          if (week.length > 0){

            var maxO=-50, minO=70, sumO=0;
            var maxI=-10, minI=70, sumI=0;
            var maxF=0, minF=1000, sumF=0;

            for (var j=0; j<week.length; j++){

              sumO += week[j].outdoorTemp;
              sumI += week[j].indoorTemp;
              sumF += week[j].frequency;

              // Outdoor
              if (week[j].outdoorTemp > maxO)
                maxO = week[j].outdoorTemp;
              if (week[j].outdoorTemp < minO)
                minO = week[j].outdoorTemp;

              // Indoor
              if (week[j].indoorTemp > maxI)
                maxI = week[j].indoorTemp;
              if (week[j].indoorTemp < minI)
                minI = week[j].indoorTemp;

              // Frequency
              if (week[j].frequency > maxF)
                maxF = week[j].frequency ;
              if (week[j].frequency  < minF)
                minF = week[j].frequency ;

            }

            obj = {
              from: week[0].createdAt,
              to: week[week.length-1].createdAt,
              indoor: {
                average: sumI / week.length,
                max: maxI,
                min: minI
              },
              outdoor: {
                average: sumO / week.length,
                max: maxO,
                min: minO
              },
              frequency: {
                average: sumF / week.length,
                max: maxF,
                min: minF
              },
              dayNo: moment(week[0].createdAt).weekday(),
              weekNo: moment(week[0].createdAt).isoWeek()
            };
            console.log(obj);

            // WeekPlot.create({
            //   from: dayStart,
            //   to: dayEnd,
            //   indoor: {
            //     average: sumI / week.length,
            //     max: maxI,
            //     min: minI
            //   },
            //   outdoor: {
            //     average: sumO / week.length,
            //     max: maxO,
            //     min: minO
            //   },
            //   frequency: {
            //     average: sumF / week.length,
            //     max: maxF,
            //     min: minF
            //   },
            //   dayNo: moment(dayStart).weekday()
            // }).exec(function(err, sensor){
            //   if (err)
            //     return cb(err);
            //   else
            //     return cb(null, sensor);
            // });

          }



        });

      }

      res.send(result);

    });

  },

  viewWeeks: function(req, res) {

  }

};

