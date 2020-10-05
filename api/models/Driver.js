objection=require("objection");
const Model=objection.Model;
//Model.knex(knex);

class Driver extends Model{
    static get tableName(){
        return "Driver"
    }

    static get relationMappings(){
        const User=require("./User.js");
        return {
            User: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join:{
                    from: "Driver.id",
                    to: "User.id"
                },
            }
        }
    }
}
