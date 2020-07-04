const UserFilmMeta = require("./userFilmMeta.model");

const createOne = async req => {
  const userId = req.user._id;
  const { filmId } = req.body;
  if (!filmId) {
    return {
      statusCode: 400,
      body: {
        errors: ["must provide filmId"]
      }
    };
  }
  try {
    const doc = await UserFilmMeta.create({
      userId,
      filmId
    });
    return {
      statusCode: 200,
      body: doc
    };
  } catch (err) {
    console.log("filmMeta createOne error: \n", err);
    return {
      statusCode: 500,
      body: {
        errors: ["mongoose error"]
      }
    };
  }
};

const getMany = async req => {
  try {
    const _id = req.user._id;
    const docs = await UserFilmMeta.find({
      userId: _id
    });
    return {
      statusCode: 200,
      body: {
        docs: docs
      }
    };
  } catch (err) {
    console.log("filmMeta getMany err:\n\n", err);
    return {
      statusCode: 500,
      body: {
        errors: ["mongoose error"]
      }
    };
  }
};

const updateOne = (req, res) => {
  res.json({ "PUT request": req.body });
};

const deleteOne = async req => {
  const { docId } = req.body;
  if (!docId) {
    return {
      statusCode: 400,
      body: {
        errors: ["must provide docId"]
      }
    };
  }
  try {
    const doc = await UserFilmMeta.findOneAndDelete({
      _id: docId
    });
    return {
      statusCode: doc ? 200 : 400,
      body: doc
        ? {
            doc: doc
          }
        : {
            errors: ["doc not found"]
          }
    };
  } catch (err) {
    console.log("filmMeta deleteOne err:\n\n", err);
    return {
      statusCode: 500,
      body: {
        errors: ["mongoose error"]
      }
    };
  }
};

module.exports = {
  createOne,
  getMany,
  updateOne,
  deleteOne
};
