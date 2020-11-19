const { knex, Model } = require("../../db");

class Passenger extends Model {
  static get tableName() {
    return "Passenger";
  }

  static get relationMappings() {
    const User = require("./User.js");
    const Ride = require("./Ride.js");
    
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "Passenger.passengerId",
          to: "User.id",
        },
      },

      ride: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ride,
        join: {
          from: "Passenger.rideId",
          to: "Ride.id",
        },
      },
    };
  }

  getPassenger() {
    return this.$relatedQuery("user")
      .select("firstName")
      .then((theUser) => {
        return theUser;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Passenger;
