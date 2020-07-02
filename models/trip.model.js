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
      return "Failed to create trip.";
    }
  },
  tripAlreadyPresent: function (body) {
    try {
      let query =
        "SELECT * FROM " +
        constants.TABLES.TRIP +
        " WHERE user_id = ? AND status = 1 ALLOW FILTERING ";
      return db.queryPromise(query, [body.user_id, body.start_date], {
        prepare: true,
      });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to get trip.";
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
      return "Failed to update trip.";
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
        "' AND status = 1 ALLOW FILTERING ";
      return db.queryPromise(query, [user_id, trip_id], {
        prepare: true,
      });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to get trip.";
    }
  },
  getTrips: function (trip_time, user_id) {
    try {
      let date = new Date().toISOString();
      let qry = "";
      if (trip_time === constants.PAST) {
        qry =
          " WHERE user_id = ? AND end_date < '" +
          date +
          "' AND status = 1 ALLOW FILTERING";
      }
      if (trip_time === constants.ONGOING) {
        qry =
          " WHERE user_id = ? AND start_date < '" +
          date +
          "' AND end_date > '" +
          date +
          "' AND status = 1 ALLOW FILTERING";
      }
      if (trip_time === constants.UPCOMING) {
        qry =
          " WHERE user_id = ? AND start_date > '" +
          date +
          "' AND status = 1 ALLOW FILTERING";
      }

      let query = "SELECT * FROM " + constants.TABLES.TRIP + qry;
      return db.queryPromise(query, [user_id], {
        prepare: true,
      });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to get trips.";
    }
  },
  checkCollisionOfDate: function (date, user_id) {
    try {
      let query = `SELECT * FROM ${constants.TABLES.TRIP} WHERE user_id = ${user_id} AND start_date <= '${date}' AND end_date >= '${date}' AND status = 1 ALLOW FILTERING`;
      return db.queryPromise(query, [], {
        prepare: true,
      });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to get trip.";
    }
  },
  checkCollisionOfStartEndDate: function (body) {
    try {
      let query = `SELECT * FROM ${constants.TABLES.TRIP} WHERE user_id = ${body.user_id} AND start_date >= '${body.start_date}' AND end_date <= '${body.end_date}' AND status = 1 ALLOW FILTERING `;
      return db.queryPromise(query, [], {
        prepare: true,
      });
    } catch (e) {
      console.log("Exception", e);
      return "Failed to get trip.";
    }
  },
};
module.exports = tripModel;
