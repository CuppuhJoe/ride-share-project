const knex = require('knex') ({
	client: 'pg',
	connection: {
		host: 'faraday.cse.taylor.edu',
		user: 'readonly',
		password: 'nerds4christ',
		database: 'dvdrental'
	}
});

objection = require('objection');
const Model = objection.Model;
Model.knex(knex);