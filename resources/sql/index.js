const { QueryFile } = require('pg-promise');
const path = require('path');

function sql(file) {
  const fullPath = path.join(__dirname, file);

  const options = {
    minify: true,
  };

  // http://vitaly-t.github.io/pg-promise/QueryFile.html
  const qf = new QueryFile(fullPath, options);

  if (qf.error) {
    console.error(qf.error);
  }

  return qf;
}

module.exports = {
  createOne: sql('./createOne.sql'),
  findOne: sql('./findOne.sql'),
  updateOne: sql('./updateOne.sql'),
  deleteOne: sql('./deleteOne.sql'),
};
