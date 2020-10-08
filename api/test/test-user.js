const User = require("../models/User.js");


const crickson = User.query().insert({
  firstName: 'Crickson',
  lastName: 'Bain',
  email: 'email@email.com',
  password: '2cool4u',
  phone: 1234560,
  isAdmin: false
});

// User.query()
// 	.insert(crickson)
// 	.catch((err) => console.log(err.message));


const {raw} = require("objection");

// const numDeleted = User.query()
// 	.deleteById(4)
//     .catch((err) => console.log(err.message));

User.query()
  .patch({ password: 'thisisyournewpasswordnow' })
  .catch((err) => console.log(err.message));


async function runTests() {
	await User.query()
	  .then((users) => {
	    users.forEach((user) => {
	      console.log("FIRSTNAME", user.firstName);

	      console.log(user);
	    });
	  })
	  .catch((err) => console.log(err.message));
}

runTests();