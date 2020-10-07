const { knex, Model } = require("../db");

class User extends Model{
    static get tableName(){
        return "User"
    }

    static get relationMappings(){
        const Driver=require("./Driver.js");
        const Passenger=require("./Passenger.js");

        return {
            driver: {
                relation: Model.HasManyRelation,
                modelClass: Driver,
                join:{
                    from: "User.id",
                    to: "Driver.userId"
                },
            },

            passenger: {
                relation: Model.HasManyRelation,
                modelClass: Passenger,
                join:{
                    from: "User.id",
                    to: "Passenger.passengerId"
                },
            }
        }
    }
    getDrivers(){
        return this.$relatedQuery("driver")
        .$relatedQuery("user")
      .select("firstName")
      .then((theUser) => {
        return theUser;
      })
      .catch((err) => {
        console.log(err);
      });
    }
}

module.exports = User;
