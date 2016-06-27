/**
 * Sensor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    from: 'date',
    to: 'date',
    indoor: {
      average: 'float',
      max: 'float',
      min: 'float'
    },
    outdoor: {
      average: 'float',
      max: 'float',
      min: 'float'
    },
    frequency: {
      average: 'float',
      max: 'float',
      min: 'float'
    }
  }
};

