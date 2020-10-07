const Passenger = require("../models/Passenger.js");

Passenger.query()
  .then((passengers) => {
    passengers.forEach((passenger) => {
      console.log("PASSENGER", passenger);

      passenger.getPassenger().then((user) => console.log("USER", user));
    });
  })
  .catch((err) => console.log(err.message));
