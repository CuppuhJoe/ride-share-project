const Vehicle_Type = require("../models/Vehicle_Type.js");

Vehicle_Type.query()
  .then((vehicle_types) => {
    vehicle_types.forEach((vehicle_type) => {
      console.log("VEHICLE_TYPE", vehicle_type);

      console.log("TYPE", vehicle_type.type);
    });
  })
  .catch((err) => console.log(err.message));
