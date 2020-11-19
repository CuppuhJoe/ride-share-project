require("../api/db");

// Load model classes.
const Company = require("./models/Company");
const Patient = require("./models/Patient");
const Vaccination = require("./models/Vaccination");
const Vaccine = require("./models/Vaccine");

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
        return "Hello, you have reached 'hapi-server'. Please leave a message after the beep.";
      },
    },

    {
      method: "GET", // Get company collection
      path: "/companies",
      handler: async (request, h) => {
        return await Company.getAllCompanies();
      },
    },

    {
      method: "GET", // Get vaccine collection
      path: "/vaccines",
      handler: async (request, h) => {
        //Below is a very helpful method. Take note of it. Remember it. Treasure it.
        return Vaccine.query().withGraphFetched("company");
      },
    },

    {
      method: "GET", // Get patient collection
      path: "/patients",
      options: {
        validate: {
          query: Joi.object({
            verbose: Joi.boolean(),
            sortby: Joi.string().valid("first", "last")
          })
        }
      },
      handler: async (request, h) => {
        let verbose = request.query.verbose;
        let sortby = request.query.sortby;

        let patients;
        if (verbose)  patients = Patient.query().withGraphFetched("vaccines");
        else          patients = Patient.query();

        if (sortby === "last")        patients.orderBy("last_name");
        else if (sortby === "first")  patients.orderBy("first_name");

        return patients;
      },
    },

    {
      method: "GET",
      path: "/patients/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let patient = await Patient.query()
          .where("id", request.params.id)
          .withGraphFetched("vaccines")
          .first();
        console.log("MATCHES", patient);
        if (patient) return patient;
        return Boom.notFound(`No patient with ID ${request.params.id}`);
      },
    },

    {
      method: "GET",
      path: "/companies/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          })
        }
      },
      handler: async (request, h) => {
        let company = await Company.getCompanyById(request.params.id);
        if (company) return company;
        return Boom.notFound(`No company with ID ${request.params.id}`);
      },
    },

    {
      method: "POST", // Create new patient
      path: "/patients",
      options: {
        validate: {
          payload: Joi.object({
            first_name: Joi.string().min(1).max(140).required(),
            last_name: Joi.string().min(1).max(140).required(),
            phone: Joi.string().pattern(/^\d{3}-?\d{3}-?\d{4}$/).required()
          })
        }
      },
      handler: async (request, h) => {
        let patient = await Patient.create(
          request.payload.first_name,
          request.payload.last_name,
          request.payload.phone
        );
        if (patient) return h.response(patient).code(201)
        return Boom.badRequest(`Could not create patient with ID ${request.params.id}`);
      },
    },

    {
      method: "POST", // Create new company
      path: "/companies",
      options: {
        validate: {
          payload: Joi.object({
            name: Joi.string().min(1).max(140).required(),
            city: Joi.string().min(1).max(140).required(),
            country: Joi.string().min(1).max(140).required()
          })
        }
      },
      handler: async (request, h) => {
        // let company = await Company.create( request.payload.name, request.payload.city, request.payload.country );
        let company = await Company.query().insert( {name: request.payload.name, city: request.payload.city, country: request.payload.country});
        if (company) return h.response(company).code(201)
        return Boom.badRequest(`Could not create company with ID ${request.params.id}`);
      },
    },

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

    {
      method: "PATCH", // Update patient by id
      path: "/patients/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            first_name: Joi.string().min(1).max(140),
            last_name: Joi.string().min(1).max(140),
            phone: Joi.string().pattern(/^\d{3}-?\d{3}-?\d{4}$/)
          })
        }
      },
      handler: async (request, h) => {
        //NOTE Should actually return just a response code, not payload content
        let patient = await Patient.update(
          request.params.id,
          request.payload.first_name,
          request.payload.last_name,
          request.payload.phone
        );
        if (patient) return patient;
        return Boom.notFound(`No patient with ID ${request.params.id}`);
      },
    },

    {
      method: "PATCH", // Update company by id
      path: "/companies/{id}",
      options: {
        validate: {
          params: Joi.object({
            id: Joi.number().integer().min(1)
          }),
          payload: Joi.object({
            name: Joi.string().min(1).max(140),
            city: Joi.string().min(1).max(140),
            country: Joi.string().min(1).max(140)
          })
        }
      },
      handler: async (request, h) => {
        let company = await Company.update(
            request.params.id,
            request.payload.name,
            request.payload.city,
            request.payload.country
        );
        if (company) return company;
        return Boom.notFound(`No company with ID ${request.params.id}`);
      },
    },

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
    }
  ]);

  console.log("Server listening on", server.info.uri);
  await server.start();
};

init();
