/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  if (sails.config.daikin.host.length == 0)
      return cb('Error: daikin.host must be configured. Add it to local.js!');

  if (sails.config.plotly.user.length == 0)
      return cb('Error: plotly.user and plotly.key must be configured. Add it to local.js!');

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  SensorService.collectContinous();

  cb();
};
