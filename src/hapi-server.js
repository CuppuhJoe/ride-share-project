require("../db.js");

// Load model classes.
const Authorization = require("../api/models/Authorization.js");
const Driver = require("../api/models/Driver.js");
const Drivers = require("../api/models/Drivers.js");
const Location = require("../api/models/Location.js");
const Passenger = require("../api/models/Passenger.js");
const Ride = require("../api/models/Ride.js");
const State = require("../api/models/State.js");
const User = require("../api/models/User.js");
const Vehicle_Type = require("../api/models/Vehicle_Type.js");
const Vehicle = require("../api/models/Vehicle.js");

// Configure Hapi.
const Hapi = require("@hapi/hapi");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");

const init = async () => {
  const server = Hapi.server({
    host: "localhost",
    port: 3000,
  });

  // Log stuff.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    },
  });

  await server.register(require("blipp"));

  server.route([
    {
      method: "GET",
      path: "/",
      handler: (request, h) => {
        return "Hello, you have reached Free Rides Only. Please do our work after the tone. BEEP";
      },
    },

    {
      method: "GET", // Get user collection
      path: "/users",
      handler: async (request, h) => {
        return User.query();
      },
    },

    {
      method: "GET", // Get driver collection
      path: "/drivers",
      handler: async (request, h) => {
        return Driver.query();
      },
    },

    {
      method: "GET", // Get passenger collection
      path: "/passengers",
      handler: async (request, h) => {
        return Passenger.query().withGraphFetched("user");
      },
    },

    {
      method: "GET", // Get driver collection
      path: "/rides",
      handler: async (request, h) => {
        return Ride.query();
      },
    },

    {
      method: "GET", // Get location collection
      path: "/locations",
      handler: async (request, h) => {
        return Location.query();
      },
    },

    {
      method: "GET", // Get vehicle collection
      path: "/vehicles",
      handler: async (request, h) => {
        return Vehicle.query();
      },
    },

    {
      method: "GET", // Get vehicle-type collection
      path: "/vehicle-types",
      handler: async (request, h) => {
        return Vehicle_Type.query();
      },
    },

    {
      method: "GET",
      path: "/users/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let user = await User.query()
          .where("id", request.params.id)
          .first();
        if (user) return user;
        return Boom.notFound(`No user with ID ${request.params.id}`);
      },
    },

    {
      method: "GET",
      path: "/drivers/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let driver = await Driver.query()
          .where("id", request.params.id)
          .first();
        if (driver) return driver;
        return Boom.notFound(`No driver with ID ${request.params.id}`);
      },
    },

    {
      method: "GET",
      path: "/passengers/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let passenger = await Passenger.query()
          .where("passengerId", request.params.id).first().withGraphFetched("user"); //NOTE should do some more complex data manip for UI here
        if (passenger) return passenger;
        return Boom.notFound(`No passenger with ID ${request.params.id}`);
      },
    },

    {
      method: "GET",
      path: "/rides/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let ride = await Ride.query()
          .where("id", request.params.id).first();
        if (ride) return ride;
        return Boom.notFound(`No ride with ID ${request.params.id}`);
      },
    },

    {
      method: "GET",
      path: "/locations/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let location = await Location.query()
          .where("id", request.params.id).first();
        if (location) return location;
        return Boom.notFound(`No location with ID ${request.params.id}`);
      },
    },

    {
      method: "GET",
      path: "/vehicles/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let vehicle = await Vehicle.query()
          .where("id", request.params.id).first();
        if (vehicle) return vehicle;
        return Boom.notFound(`No vehicle with ID ${request.params.id}`);
      },
    },

    {
      method: "GET",
      path: "/vehicle-types/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let vehicleType = await Vehicle_Type.query()
          .where("id", request.params.id).first();
        if (vehicleType) return vehicleType;
        return Boom.notFound(`No vehicle-type with ID ${request.params.id}`);
      },
    },

    {
      method: "POST", // Create new user
      path: "/users",
      options: {
        validate: {
          payload: Joi.object({
            firstName: Joi.string().min(1).max(140).required(),
            lastName: Joi.string().min(1).max(140).required(),
            email: Joi.string().min(1).max(140).required(),
            password: Joi.string().min(1).max(140).required(),
            phone: Joi.number().integer().min(1000000).max(9999999999).required(),
            isAdmin: Joi.boolean().required()
          })
        }
      },
      handler: async (request, h) => {
        let user = await User.query().insert(request.payload);
        if (user) return h.response(user).code(201);
        return Boom.badRequest(`Could not create user with ID ${request.params.id}`);
      }
    },

    {
      method: "POST", // Register user as driver
      path: "/drivers",
      options: {
        validate: {
          payload: Joi.object({
            licenseNumber: Joi.string().min(1).max(30).required(),
            licenseState: Joi.string().min(1).max(2).required(),
          })
        }
      },
      handler: async (request, h) => {
        let driver = await Driver.query().insert({
          userId: 1,  //NOTE Currently makes user 1 default driver in all cases, so that an admin can create a new driver and then patch in the correct userId immediately afterward
          licenseNumber: request.payload.licenseNumber,
          licenseState: request.payload.licenseState
        });
        if (driver) return h.response(driver).code(201);
        return Boom.badRequest(`Could not create driver with ID ${request.params.id}`); //NOTE Should verify user is not already registered as a driver
      }
    },

    {
      method: "POST", // Register user as passenger for a specific ride
      path: "/passengers",
      options: {
        validate: {
          payload: Joi.object({
            passengerId: Joi.number().integer().min(1),
            rideId: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        if(!(await User.query().findById(request.payload.passengerId))){
          return h
            .response(`User ${request.payload.passengerId} not found`)
            .code(404);
        }
        if(!(await Ride.query().findById(request.payload.rideId))){
          return h
            .response(`Ride ${request.payload.rideId} not found`)
            .code(404);
        }
      
        const passengers = await Passenger.query().where({
          passengerId: request.payload.passengerId,
          rideId: request.payload.rideId, 
        });
        if(passengers.length > 0){
          return h
            .response(`User ${request.payload.passengerId} is already riding on Ride ${request.payload.rideId}`)
            .code(400);
        }

        return Passenger.query().insert({
          passengerId: request.payload.passengerId,
          rideId: request.payload.rideId,
        }).returning('*');
      }
    },

    {
      method: "POST", // Create new ride
      path: "/rides",
      options: {
        validate: {
          payload: Joi.object({
            date: Joi.string().min(1).max(50).required(),
            time: Joi.string().min(1).max(20).required(),
            distance: Joi.number().required(),
            fee: Joi.number().required(),
            vehicleId: Joi.number().integer().required(),
            fromLocationId: Joi.number().integer().required(),
            toLocationId: Joi.number().integer().required()
          })
        }
      },
      handler: async (request, h) => {
        let ride = await Ride.query().insert(request.payload);
        if (ride) return h.response(ride).code(201);
        return Boom.badRequest(`Could not create ride with ID ${request.params.id}`);
      }
    },

    {
      method: "POST", // Create new location
      path: "/locations",
      options: {
        validate: {
          payload: Joi.object({
            name: Joi.string().min(1).max(140).required(),
            address: Joi.string().min(1).max(140).required(),
            city: Joi.string().min(1).max(140).required(),
            state: Joi.string().min(1).max(2).required(),
            zipCode: Joi.string().min(1).max(15).required(),
            fuelPrice: Joi.number().required(),
          })
        }
      },
      handler: async (request, h) => {
        let location = await Location.query().insert({
          name: request.payload.name,
          address: request.payload.address,
          city: request.payload.city,
          state: request.payload.state, //NOTE Postman sees actual value, Postgres gets <null>
          zipCode: request.payload.zipCode,
          fuelPrice: request.payload.fuelPrice,
        });
        if (location) return h.response(location).code(201);
        return Boom.badRequest(`Could not create location with ID ${request.params.id}`);
      }
    },

    {
      method: "POST", // Create new vehicle
      path: "/vehicles",
      options: {
        validate: {
          payload: Joi.object({
            make: Joi.string().min(1).max(140).required(),
            model: Joi.string().min(1).max(140).required(),
            color: Joi.string().min(1).max(140).required(),
            vehicleTypeId: Joi.number().integer().required(),
            capacity: Joi.number().integer().required(),
            licenseState: Joi.string().min(1).max(2).required(),
            licensePlate: Joi.string().min(1).max(15).required(),
          })
        }
      },
      handler: async (request, h) => {
        let vehicle = await Vehicle.query().insert({
          make: request.payload.make,
          model: request.payload.model,
          color: request.payload.color,
          vehicleTypeId: request.payload.vehicleTypeId, //NOTE Postman sees actual value, Postgres gets <null>
          capacity: request.payload.capacity,
          licenseState: request.payload.licenseState,
          licensePlate: request.payload.licensePlate,
        });
        if (vehicle) return h.response(vehicle).code(201);
        return Boom.badRequest(`Could not create vehicle with ID ${request.params.id}`);
      }
    },

    {
      method: "POST", // Create new vehicle-type
      path: "/vehicle-types",
      options: {
        validate: {
          payload: Joi.object({
            type: Joi.string().min(1).max(140).required()
          })
        }
      },
      handler: async (request, h) => {
        let vehicleType = await Vehicle_Type.query().insert({
          type: request.payload.type
        });
        if (vehicleType) return h.response(vehicleType).code(201);
        return Boom.badRequest(`Could not create vehicle-type with ID ${request.params.id}`);
      }
    },

    {
      method: "POST", // Create new driver-on-ride association.
      path: "/drivers/{did}/rides/{rid}",
      options: {
        validate: {
          params: Joi.object({
            did: Joi.number().integer().min(1).required(),
            rid: Joi.number().integer().min(1).required()
          })
        }
      },
      handler: async (request, h) => {
        if(!(await Driver.query().findById(request.params.did))){
          return h
            .response(`Driver ${request.params.did} not found`)
            .code(404);
        }
        if(!(await Ride.query().findById(request.params.rid))){
          return h
            .response(`Ride ${request.params.rid} not found`)
            .code(404);
        }
      
        const drivers = await Drivers.query().where({
          driverId: request.params.did,
          rideId: request.params.rid, 
        });
        if(drivers.length > 0){
          return h
            .response(`Driver ${request.params.did} is already driving Ride ${request.params.rid}`)
            .code(400);
        }

        return Drivers.query().insert({
          driverId: request.params.did,
          rideId: request.params.rid,
        }).returning('*');

        /*
          return Driver.relatedQuery("drivers")
          .for(request.params.did)
          .relate(request.params.rid)
          .then(() => h.response()); 
        */
      },
    },

    {
      method: "POST", // Create new driver vehicle authorization.
      path: "/drivers/{did}/vehicles/{vid}",
      options: {
        validate: {
          params: Joi.object({
            did: Joi.number().integer().min(1).required(),
            vid: Joi.number().integer().min(1).required()
          })
        }
      },
      handler: async (request, h) => {
        if(!(await Driver.query().findById(request.params.did))){
          return h
            .response(`Driver ${request.params.did} not found`)
            .code(404);
        }
        if(!(await Vehicle.query().findById(request.params.vid))){
          return h
            .response(`Vehicle ${request.params.vid} not found`)
            .code(404);
        }
      
        const authorizations = await Authorization.query().where({
          driverId: request.params.did,
          vehicleId: request.params.vid, 
        });
        if(authorizations.length > 0){
          return h
            .response(`Driver ${request.params.did} is already authorized to drive Vehicle ${request.params.vid}`)
            .code(400);
        }

        return Authorization.query().insert({
          driverId: request.params.did,
          vehicleId: request.params.vid,
        }).returning('*');
      },
    },

    {
      method: "PATCH", // Update user by id
      path: "/users/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            firstName: Joi.string().min(1).max(140),
            lastName: Joi.string().min(1).max(140),
            email: Joi.string().min(1).max(140),
            password: Joi.string().min(1).max(140),
            phone: Joi.number().integer().min(1000000).max(9999999999),
            isAdmin: Joi.boolean()
          })
        }
      },
      handler: async (request, h) => {
        //NOTE Should (and does) actually return just a response code, not payload content
        let user = await User.query()
            .findById(request.params.id)
            .patch(request.payload);
        if (user) return user;
        return Boom.notFound(`No user with ID ${request.params.id}`);
      },
    },

    {
      method: "PATCH", // Update driver by id
      path: "/drivers/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            licenseNumber: Joi.string().min(1).max(140),
            licenseState: Joi.string().min(1).max(2)
          })
        }
      },
      handler: async (request, h) => {
        let driver = await Driver.query()
            .findById(request.params.id)
            .patch({
              userId: 1,
              licenseNumber: request.payload.licenseNumber,
              licenseState: request.payload.licenseState
            });
        if (driver) return driver;
        return Boom.notFound(`No driver with ID ${request.params.id}`);
      },
    },

    {
      method: "PATCH", // Update ride by id
      path: "/rides/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            date: Joi.string().min(1).max(50).required(),
            time: Joi.string().min(1).max(20).required(),
            distance: Joi.number().required(),
            fee: Joi.number().required(),
            vehicleId: Joi.number().integer().required(),
            fromLocationId: Joi.number().integer().required(),
            toLocationId: Joi.number().integer().required()
          })
        }
      },
      handler: async (request, h) => {
        let ride = await Ride.query()
            .findById(request.params.id)
            .patch(request.payload);
        if (ride) return ride;
        return Boom.notFound(`No ride with ID ${request.params.id}`);
      },
    },

    {
      method: "PATCH", // Update location by id
      path: "/locations/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            name: Joi.string().min(1).max(140).required(),
            address: Joi.string().min(1).max(140).required(),
            city: Joi.string().min(1).max(140).required(),
            state: Joi.string().min(1).max(2).required(),
            zipCode: Joi.string().min(1).max(15).required(),
            fuelPrice: Joi.number().required(),
          })
        }
      },
      handler: async (request, h) => {
        let location = await Location.query()
            .findById(request.params.id)
            .patch(request.payload);
        if (location) return location;
        return Boom.notFound(`No location with ID ${request.params.id}`);
      },
    },

    {
      method: "PATCH", // Update vehicle by id
      path: "/vehicles/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            make: Joi.string().min(1).max(140).required(),
            model: Joi.string().min(1).max(140).required(),
            color: Joi.string().min(1).max(140).required(),
            vehicleTypeId: Joi.number().integer().required(),
            capacity: Joi.number().integer().required(),
            licenseState: Joi.string().min(1).max(2).required(),
            licensePlate: Joi.string().min(1).max(15).required(),
          })
        }
      },
      handler: async (request, h) => {
        let vehicle = await Vehicle.query()
            .findById(request.params.id)
            .patch(request.payload);
        if (vehicle) return vehicle;
        return Boom.notFound(`No vehicle with ID ${request.params.id}`);
      },
    },

    {
      method: "PATCH", // Update vehicle-type by id
      path: "/vehicle-types/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            type: Joi.string().min(1).max(140).required()
          })
        }
      },
      handler: async (request, h) => {
        let vehicleType = await Vehicle_Type.query()
            .findById(request.params.id)
            .patch(request.payload);
        if (vehicleType) return vehicleType;
        return Boom.notFound(`No vehicle-type with ID ${request.params.id}`);
      },
    },
  ]);

  console.log("Server listening on", server.info.uri);
  await server.start();
};

init();
