const { knex, Model } = require("../db");

class Authorization extends Model {
  static get tableName() {
    return "Authorization";
  }

  static get relationMappings() {
    const Driver = require("./Driver.js");
    const Vehicle = require("./Vehicle.js");
    
    return {
      driver: {
        relation: Model.BelongsToOneRelation,
        modelClass: Driver,
        join: {
          from: "Authorization.driverId",
          to: "Driver.id",
        },
      },

      vehicle: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vehicle,
        join: {
          from: "Authorization.vehicleId",
          to: "Vehicle.id",
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

module.exports = Authorization;
