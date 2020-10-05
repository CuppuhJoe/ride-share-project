const knex = require('knex') ({
	client: 'pg',
	connection: {
		host: 'faraday.cse.taylor.edu',
		user: 'daniel_robb',
		password: 'zohopefu',
		database: 'daniel_robb'
	}
});

module.exports = knex;