const { knex, Model } = require("../db");

class Driver extends Model {
  static get tableName() {
    return "Driver";
  }

  static get relationMappings() {
    const User = require("./User.js");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "Driver.userId",
          to: "User.id",
        },
      },
    };
  }

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
}

module.exports = Driver;
