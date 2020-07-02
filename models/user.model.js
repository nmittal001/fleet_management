const db = require("../lib/db.js");
var utils = require("../lib/utils.js");
const constants = require("../config/constants");

let userModel = {
  getUser: function (body) {
    try {
      let query =
        "SELECT * FROM " +
        constants.TABLES.USER +
        " WHERE email = '" +
        body.email +
        "' AND status =1 ALLOW FILTERING ";
      return db.queryPromise(query, [], { prepare: true });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to get user.";
    }
  },
  addUser: function (body) {
    try {
      let query =
        "INSERT INTO " +
        constants.TABLES.USER +
        " (user_id, created_at, driver_license, email, first_name, last_name, password, phone_no, status, updated_at) VALUES ( now(), dateof(now()), ?, ?, ?, ?, ?, ?, 1, dateof(now()))";
      return db.queryPromise(
        query,
        [
          body.driver_license,
          body.email,
          body.first_name,
          body.last_name,
          body.password,
          body.phone_no,
        ],
        { prepare: true }
      );
    } catch (e) {
      console.log("Exception", e);
      return "Failed to add user.";
    }
  },
  updateUserProfile: function (user_id, body) {
    try {
      let query =
        "UPDATE " +
        constants.TABLES.USER +
        " SET updated_at = dateof(now()), " +
        utils.updateQueryGenerator(body) +
        "  WHERE user_id = " +
        user_id;
      let values = Object.values(body);
      return db.queryPromise(query, values, { prepare: true });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to update.";
    }
  },
};
module.exports = userModel;
