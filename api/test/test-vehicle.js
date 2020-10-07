const Vehicle = require("../models/Vehicle.js");

Vehicle.query()
  .then((vehicles) => {
    vehicles.forEach((vehicle) => {
      console.log("VEHICLE", vehicle);

      console.log("MODEL", vehicle.model);
    });
  })
  .catch((err) => console.log(err.message));
