const { knex, Model } = require("../../db");

class Drivers extends Model {
  static get tableName() {
    return "Drivers";
  }

  static get relationMappings() {
    const Driver = require("./Driver.js");
    const Ride = require("./Ride.js");
    
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

  getDriverId() {
    return this.$relatedQuery("driver")
      .select("userId")
      .then((theId) => {
        return theId;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Drivers;
