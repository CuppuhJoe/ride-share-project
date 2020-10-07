const Ride = require("../models/Ride.js");

Ride.query()
  .then((rides) => {
    rides.forEach((ride) => {
      console.log("RIDE", ride);

      console.log("ID", ride.id)
    });
  })
  .catch((err) => console.log(err.message));
