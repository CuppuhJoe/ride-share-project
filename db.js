require("dotenv").config();

// Connect knex to the database.
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "faraday.cse.taylor.edu",
    user: "daniel_robb",
    password: "zohopefu",
    database: "daniel_robb"
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE
  },
});

// Connect objection to knex.
const { Model } = require("objection");
Model.knex(knex);

module.exports = { knex, Model };
