const { knex, Model } = require("../db");

class State extends Model {
  static get tableName() {
    return "State";
  }

  static get relationMappings() {
    const Driver = require("./Driver.js");
    const Location = require("./Location.js");
    const Vehicle = require("./Vehicle.js");

    return {
      driver: {
        relation: Model.HasManyRelation,
        modelClass: Driver,
        join: {
          from: "State.abbreviation",
          to: "Driver.licenseState",
        },
      },
      location: {
        relation: Model.HasManyRelation,
        modelClass: Location,
        join: {
          from: "State.abbreviation",
          to: "Location.state",
        },
      },
      vehicle: {
        relation: Model.HasManyRelation,
        modelClass: Vehicle,
        join: {
          from: "State.abbreviation",
          to: "Vehicle.licenseState",
        },
      },
    };
  }
}

module.exports = State;

