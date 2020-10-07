const User = require("../models/User.js");

User.query()
  .then((users) => {
    users.forEach((user) => {
      console.log("USER", user);

      console.log("FIRSTNAME", user.firstName);
    });
  })
  .catch((err) => console.log(err.message));
