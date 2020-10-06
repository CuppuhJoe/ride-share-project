// Connect knex to the database.
const knex = require('knex') ({
	client: 'pg',
	connection: {
		host: 'faraday.cse.taylor.edu',
		user: 'daniel_robb',
		password: 'zohopefu',
		database: 'daniel_robb'
	}
});

// Connect objection to knex.
const { Model } = require("objection");
Model.knex(knex);

module.exports = { knex, Model };
