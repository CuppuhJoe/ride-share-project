const Location = require("../models/Location.js");

Location.query()
  .then((locations) => {
    locations.forEach((location) => {
      console.log("LOCATION", location);

      console.log("NAME", location.name);
    });
  })
  .catch((err) => console.log(err.message));
