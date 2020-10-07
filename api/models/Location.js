const { knex, Model } = require("../db");

class Location extends Model {
  static get tableName() {
    return "Location";
  }

  static get relationMappings() {
    const Ride = require("./Ride.js");
    const State = require("./State.js");

    return {
      ride: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: "Location.id",
          to: "Ride.fromLocationId",
        },
        join: {
          from: "Location.id",
          to: "Ride.toLocationId",
        },
      },
      state: {
        relation: Model.BelongsToOneRelation,
        modelClass: State,
        join: {
          from: "Location.id",
          to: "State.abbreviation",
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

module.exports = Location;

