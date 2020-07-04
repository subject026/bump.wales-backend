module.exports = async (req) => {
  return {
    statusCode: 400,
    body: {
      errors: ["no controller matched for that route!"],
    },
  };
};
