const pgp = require("pg-promise")({ capSQL: true });

const db = require("../DB");

const generateAdaptors = (modelName, validate) => ({
  create(data) {
    validate(data);
    return Object.freeze({
      ...data,
      async save() {
        try {
          //
          //
          const cs = new pgp.helpers.ColumnSet(
            Object.keys(data),
            { table: modelName },
          );
          const query = pgp.helpers.insert(data, cs);
          const doc = await db.oneOrNone(query + "RETURNING *");

          return doc;
        } catch (err) {
          console.log("createResource error: ", err);
          return false;
        }
      },
    });
  },
  async find(filter = false) {
    try {
      if (!filter) {
        const res = await db.many(`select * from ${modelName};`);
        return res;
      }
      // if we have filter
      const filterKeys = Object.keys(filter);
      if (filterKeys.length > 1) {
        throw new Error(
          "Model.find() - filter must only be one key/value pair",
        );
      }
      const field = filterKeys[0];
      const value = filter[field];
      const res = await db.any(
        `
          SELECT * FROM ${modelName}
            WHERE ${field} = '${value}';`,
        { field, value },
      );
      return res;
    } catch (err) {
      return err;
    }
  },
  async update(filter, updates) {
    try {
      const filterField = Object.keys(filter)[0];
      const filterValue = filter[filterField];

      const updateFields = Object.keys(updates);

      const query = `UPDATE ${modelName}
                      SET ${
        updateFields
          .map((field) => {
            const str = `${field} = '${updates[field]}'`;
            return str;
          })
          .join("")
      }
                      WHERE ${filterField} = '${filterValue}'
                      RETURNING *`;
      const doc = await db.oneOrNone(query);
      return doc;
    } catch (err) {
      console.log(err);
    }
  },
  async delete(filter) {
    try {
      const filterField = Object.keys(filter)[0];
      const filterValue = filter[filterField];
      await db.none(
        `DELETE FROM ${modelName} WHERE ${filterField} = '${filterValue}'`,
      );
      return true;
    } catch (err) {
      console.log(err);
    }
  },
});

module.exports = generateAdaptors;
