const User = require("../models/User.js");

/*PRINT ALL USERS*/
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

/*DEFINE NEW USER*/
// crickson = {
//   id: 0,
//   firstName: "Crickson",
//   lastName: "Bain",
//   email: "emdail@email.com",
//   password: "2cool4u",
//   phone: 1234560,
//   isAdmin: false,
// }

/*INSERT NEW USER*/
// User.query()
// 	.insert(crickson) //Replace with new user object
//   .then(result => console.log(result))
// 	.catch((err) => console.log(err.message));

/*DELETE USER BY ID*/
// User.query()
// 	.deleteById(0) //Replace with id of entry to be removed
//   .catch((err) => console.log(err.message));

/*UPDATE ALL USERS' PASSWORDS*/
// User.query()
//   .patch({ password: "thisisyournewpasswordnow" }) //Replace with field and value to reset all to
//   .catch((err) => console.log(err.message));

runTests();
