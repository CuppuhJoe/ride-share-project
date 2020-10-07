const Authorization = require("../models/Authorization.js");

Authorization.query()
  .then((authorizations) => {
    authorizations.forEach((authorization) => {
      console.log("AUTHORIZATION", authorization);

      authorization.getDriverId().then((id) => console.log("ID", id));
    });
  })
  .catch((err) => console.log(err.message));
