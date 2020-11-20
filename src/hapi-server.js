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
      method: "GET", // Get driver collection
      path: "/rides",
      handler: async (request, h) => {
        return Ride.query();
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
        //NOTE Should (does?) actually return just a response code, not payload content
        let user = await User.query()
            .findById(request.params.id)
            .patch(request.payload);
        if (user) return user;
        return Boom.notFound(`No user with ID ${request.params.id}`);
      },
    },

    {
      method: "POST", // Create new driver-on-ride association.
      path: "/drivers/{did}/rides/{rid}",
      options: {
        validate: {
          params: Joi.object({
            did: Joi.number().integer().min(1),
            rid: Joi.number().integer().min(1)
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

        if(drivers.length>0){
            return h
              .response(`Driver ${request.params.did} is already driving Ride ${request.params.rid}`)
              .code(400);
        }

        return Driver.relatedQuery("drivers")
          .for(request.params.did)
          .relate(request.params.rid)
          .then(()=>h.response());
      },
    },
  ]);

  console.log("Server listening on", server.info.uri);
  await server.start();
};

init();


/*

    {
      method: "POST", // Create new vaccination record.
      path: "/patients/{pid}/vaccines/{vid}",
      options: {
        validate: {
          params: Joi.object({
            pid: Joi.number().integer().min(1),
            vid: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let response = await Vaccination.create(request.params.pid, request.params.vid);

        if (response == "BADUSER") {
          return Boom.notFound(`Patient with ID ${request.params.pid} does not exist`);
        } else if (response == "BADVACCINE") {  
          return Boom.notFound(`Vaccine with ID ${request.params.vid} does not exist`);
        } else if (response == "DUPLICATE") {  
          return Boom.badRequest(`User with ID ${request.params.pid} already has vaccine with ID ${request.params.vid}`);
        }
        return h.response(response).code(201)
      },
    },
    */