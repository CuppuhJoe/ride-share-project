const Driver = require("../models/Driver.js");

Driver.query()
  .then((drivers) => {
    drivers.forEach((driver) => {
      console.log(driver);

      driver.getUser().then((user) => console.log(user));
    });
  })
  .catch((err) => console.log(err.message));
