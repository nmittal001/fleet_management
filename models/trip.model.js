const db = require("../lib/db.js");
var utils = require("../lib/utils.js");
const constants = require("../config/constants");

let tripModel = {
  createTrip: function (body) {
    try {
      let query =
        "INSERT INTO " +
        constants.TABLES.TRIP +
        " (user_id, id, created_at, destination_location, end_date, purpose_of_visit, source_location, start_date, status, updated_at) VALUES ( ?, now(), dateof(now()), ?, ?, ?, ?, ?, 1, dateof(now()))";
      return db.queryPromise(
        query,
        [
          body.user_id,
          body.destination_location,
          body.end_date,
          body.purpose_of_visit,
          body.source_location,
          body.start_date,
        ],
        { prepare: true }
      );
    } catch (e) {
      console.log("Exception", e);
      return "Failed to add user.";
    }
  },
  tripAlreadyPresent: function (body) {
    try {
      let query =
        "SELECT * FROM " +
        constants.TABLES.TRIP +
        " WHERE user_id = ? AND start_date = ? ALLOW FILTERING ";
      return db.queryPromise(query, [body.user_id, body.start_date], {
        prepare: true,
      });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to add user.";
    }
  },
  updateTrip: function (trip_id, user_id, body) {
    try {
      let query =
        "UPDATE " +
        constants.TABLES.TRIP +
        " SET updated_at = dateof(now()), " +
        utils.updateQueryGenerator(body) +
        "  WHERE user_id = " +
        user_id +
        " AND id = " +
        trip_id;
      let values = Object.values(body);
      return db.queryPromise(query, values, { prepare: true });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to add user.";
    }
  },
  getUpcompingTripById: function (trip_id, user_id) {
    try {
      let date = new Date().toISOString();
      let query =
        "SELECT * FROM " +
        constants.TABLES.TRIP +
        " WHERE user_id = ? AND id = ? AND start_date > '" +
        date +
        "' ALLOW FILTERING ";
      console.log("query-->>", query);
      console.log("->", trip_id, user_id, date);
      return db.queryPromise(query, [user_id, trip_id], {
        prepare: true,
      });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to add user.";
    }
  },
};
module.exports = tripModel;
