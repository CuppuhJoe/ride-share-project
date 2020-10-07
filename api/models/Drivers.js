const { knex, Model } = require("../db");

class Drivers extends Model {
  static get tableName() {
    return "Drivers";
  }

  static get relationMappings() {
    const Driver = require("./Driver.js");
    const Vehicle = require("./Vehicle.js");
    
    return {
      driver: {
        relation: Model.BelongsToOneRelation,
        modelClass: Driver,
        join: {
          from: "Drivers.driverId",
          to: "Driver.id",
        },
      },

      ride: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ride,
        join: {
          from: "Drivers.rideId",
          to: "Ride.id",
        },
      },
    };
  }
}

module.exports = Drivers;
