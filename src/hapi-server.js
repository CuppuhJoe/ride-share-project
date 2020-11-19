require("../db");

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
const Joi = require("joi");

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
      method: "GET", // Get patient collection
      path: "/users",
      handler: async (request, h) => {
        return User.query();
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
            email: Joi.string().email().min(1).max(140).required(),
            password: Joi.string().min(1).max(140).required(),
            phone: Joi.string().pattern(/^\d{3}-?\d{3}-?\d{4}$/).required(),
            isAdmin: Joi.boolean().required()
        }
      },
      handler: async (request, h) => {
        let user = await User.query().insert( {
          firstName: request.payload.firstName,
          lastName: request.payload.lastName,
          email: request.payload.email,
          password: request.payload.password,
          phone: request.payload.phone,
          isAdmin: request.payload.isAdmin,
        });
        if (user) return h.response(user).code(201);
        return Boom.badRequest(`Could not create user with ID ${request.params.id}`);
      },
    },
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
    {
      method: "PATCH", // Update patient by id
      path: "/users/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            firstName: Joi.string().min(1).max(140).required(),
            lastName: Joi.string().min(1).max(140).required(),
            email: Joi.string().email().min(1).max(140).required(),
            password: Joi.string().min(1).max(140).required(),
            phone: Joi.string().pattern(/^\d{3}-?\d{3}-?\d{4}$/).required(),
            isAdmin: Joi.boolean().required()
          })
        }
      },
      handler: async (request, h) => {
        //NOTE Should (does?) actually return just a response code, not payload content
        let user = await Patient.query()
            .findById(request.params.id)
            .patch(request.payload);
        if (user) return user;
        return Boom.notFound(`No user with ID ${request.params.id}`);
      },
    },
/*
    {
      method: "DELETE", // Delete a vaccination record.
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
        //NOTE Should actually return just a response code, not payload content
        const deletedCount = await Vaccination.query().delete().where({
          patient_id: request.params.pid,
          vaccine_id: request.params.vid
        });
        if (deletedCount === 0) return Boom.notFound(`No such Vaccination`);
        return h.response("Patient successfully deleted.").code(200)
      }
    }*/
  ]);

  console.log("Server listening on", server.info.uri);
  await server.start();
};

init();
