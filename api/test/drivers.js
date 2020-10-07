const Drivers = require("../models/Drivers.js");

Drivers.query()
  .then((drivers) => {
    drivers.forEach((driver) => {
      console.log("DRIVER", driver);

      driver.getDriverId().then((id) => console.log("ID", id));
    });
  })
  .catch((err) => console.log(err.message));
