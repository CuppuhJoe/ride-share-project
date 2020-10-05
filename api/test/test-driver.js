const knex = require('../db.js');

const Driver = require('../models/Driver.js');
Driver.knex(knex);

Driver.query()
	.then(drivers => {
		drivers.forEach(thisDriver => {
			if(thisDriver.id == 2) {
				console.log(thisDriver.licenseNumber);
			}
		});
		knex.destroy();
	})
	.catch(err => console.log(err.message));