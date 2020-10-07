const { knex, Model } = require("../db");

class Vehicle_Type extends Model {
  static get tableName() {
    return "Vehicle_Type";
  }

  static get relationMappings() {
    const Vehicle = require("./Vehicle.js");

    return {
      vehicle: {
        relation: Model.HasManyRelation,
        modelClass: Vehicle,
        join: {
          from: "Vehicle_Type.id",
          to: "Vehicle.vehicleTypeId",
        },
      },
    };
  }

  /*
  getUser() {
    return this.$relatedQuery("user")
      .select("firstName")
      .then((theUser) => {
        return theUser;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  */
}

module.exports = Vehicle_Type;

