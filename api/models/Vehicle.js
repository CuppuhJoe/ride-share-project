const { knex, Model } = require("../../db");

class Vehicle extends Model {
  static get tableName() {
    return "Vehicle";
  }

  static get relationMappings() {
    const Ride = require("./Ride.js");
    const Vehicle_Type = require("./Vehicle_Type.js");
    const State = require("./State.js");
    const Authorization = require("./Authorization.js");

    return {
      ride: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: "Vehicle.id",
          to: "Ride.vehicleId",
        },
      },
      vehicle_type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vehicle_Type,
        join: {
          from: "Vehicle.id",
          to: "Vehicle_Type.id",
        },
      },
      state: {
        relation: Model.BelongsToOneRelation,
        modelClass: State,
        join: {
          from: "Vehicle.id",
          to: "State.abbreviation",
        },
      },
      authorization: {
        relation: Model.HasManyRelation,
        modelClass: Authorization,
        join: {
          from: "Vehicle.id",
          to: "Authorization.vehicleId",
        },
      },
    };
  }
}

module.exports = Vehicle;

