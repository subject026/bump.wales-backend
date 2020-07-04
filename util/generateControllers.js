const generateControllers = (Model) => {
  return {
    async create(data) {
      try {
        const doc = await Model.create(data);
        return {
          status: 200,
          data: doc,
        };
      } catch (err) {
        return {
          status: 500,
          data: { error: err },
        };
      }
    },
  };
};

module.exports = generateControllers;
