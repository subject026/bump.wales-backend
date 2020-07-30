const generateControllers = (Model) => {
  return {
    async create(req) {
      try {
        console.log(Model);
        const doc = await Model.create(req.body).save();
        return {
          statusCode: 200,
          body: doc,
        };
      } catch (err) {
        console.log(err);
        // mongoose errors come back like err.message
        return {
          statusCode: 500,
          body: { errors: [err.message] },
        };
      }
    },
    async find(req) {
      try {
        if (Object.keys(req.body).length < 1) {
          // find all
          console.log("finding ", Model.modelName);
          console.log(req.body);
          const docs = await Model.find();
          console.log(docs.length);
          return {
            statusCode: 200,
            body: docs,
          };
        }
        // find based on query
        const docs = await Model.find(req.body);
        return {
          statusCode: 200,
          body: docs,
        };
      } catch (err) {
        console.log(`find ${Model.modelName} error: `, err);
        return {
          statusCode: 500,
          body: {
            errors: [err.message],
          },
        };
      }
    },

    // async update(req) {
    // !!!
    // },
    async delete(req) {
      if (!req.body.id) {
        return {
          statusCode: 500,
          body: {
            errors: ["delete controller - no doc id provided!"],
          },
        };
      }
      try {
        const result = await Model.delete({ id: req.body.id });

        return {
          statusCode: result ? 200 : 500,
          body: result ? { complete: true } : { errors: ["doc not found"] },
        };
      } catch (err) {
        console.log(err);
        return {
          statusCode: 500,
          body: {
            errors: [err.message],
          },
        };
      }
    },
  };
};

module.exports = generateControllers;
