const State = require("../models/State.js");

State.query()
  .then((states) => {
    states.forEach((state) => {
      console.log("VEHICLE", state);

      console.log("ABBREVIATION", state.abbreviation);
    });
  })
  .catch((err) => console.log(err.message));
