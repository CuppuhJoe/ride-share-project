objection=require("objection");
const Model=objection.Model;

class User extends Model{
    static get tableName(){
        return "User"
    }

    static get relationMappings(){
        const Driver=require("./Driver.js");
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: Driver,
                join:{
                    from: "User.id",
                    to: "Driver.userId"
                },
            }
        }
    }
    getDrivers(){
        return this.$relatedQuery("driver");
    }
}

module.exports = User;
