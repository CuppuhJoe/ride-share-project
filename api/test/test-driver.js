const Driver = require("../models/Driver.js");

Driver.query()
  .then((drivers) => {
    drivers.forEach((driver) => {
      console.log("DRIVER", driver);

      driver.getUser().then((user) => console.log("USER", user));
    });
  })
  .catch((err) => console.log(err.message));
