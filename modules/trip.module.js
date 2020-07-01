const tripModel = require("../models/trip.model");
let tripModule = {
  createTrip: async function (body, callback) {
    try {
      tripAlreadyPresent = await tripModel.tripAlreadyPresent(body);
      if (tripAlreadyPresent.rows && tripAlreadyPresent.rows.length > 0) {
        callback({ success: 0, message: "Trip already present" });
      }
      tripModel
        .createTrip(body)
        .then(function (value) {
          if (value) {
            callback({
              success: 1,
              message: "Trip added successfully",
            });
          } else {
            callback({ success: 0, message: "Fail to add trip" });
          }
        })
        .catch(function (err) {
          console.log(err);
          callback({ success: 0, message: "Fail to add trip" });
        });
    } catch (e) {
      console.log(e);
      callback({ success: 0, message: "Fail to add trip" });
    }
  },
  updateTrip: async function (trip_id, user_id, body, callback) {
    try {
      tripDetails = await tripModel.getUpcompingTripById(trip_id, user_id);
      if (tripDetails.rows && tripDetails.rows.length == 0) {
        return callback({
          success: 0,
          message: "Trip id is not present or this is not upcoming trip",
        });
      }
      let validator = updateTripValidatior(body, tripDetails.rows[0]);
      if (!validator.continue) {
        return callback({ success: 0, message: validator.message });
      }
      tripModel
        .updateTrip(trip_id, user_id, body)
        .then(function (value) {
          if (value) {
            callback({
              success: 1,
              message: "Trip updated successfully",
            });
          } else {
            callback({ success: 0, message: "Fail to update trip" });
          }
        })
        .catch(function (err) {
          console.log(err);
          callback({ success: 0, message: "Fail to update trip" });
        });
    } catch (e) {
      console.log(e);
      callback({ success: 0, message: "Fail to update trip" });
    }
  },
};
module.exports = tripModule;

var updateTripValidatior = (body, dpTripDetails) => {
  if (
    body.hasOwnProperty("source_location") &&
    body.hasOwnProperty("destination_location")
  ) {
    if (body.destination_location === body.source_location) {
      return {
        continue: false,
        message: "destination_location and source_location are same",
      };
    }
  }
  if (
    body.hasOwnProperty("source_location") &&
    !body.hasOwnProperty("destination_location")
  ) {
    if (dpTripDetails.destination_location === body.source_location) {
      return {
        continue: false,
        message: "destination_location and source_location are same",
      };
    }
  }
  if (
    !body.hasOwnProperty("source_location") &&
    body.hasOwnProperty("destination_location")
  ) {
    if (body.destination_location === dpTripDetails.source_location) {
      return {
        continue: false,
        message: "destination_location and source_location are same",
      };
    }
  }
  if (body.hasOwnProperty("start_date")) {
    let diffDate = new Date(body.start_date) - new Date();
    if (diffDate <= 0) {
      return {
        continue: false,
        message: "start_date is less than present date and time.",
      };
    }
  }
  if (body.hasOwnProperty("start_date") && body.hasOwnProperty("end_date")) {
    let diffDate = new Date(body.end_date) - new Date(body.start_date);
    if (diffDate <= 0) {
      return {
        continue: false,
        message: "end_date should be greater than start_date",
      };
    }
  }
  if (!body.hasOwnProperty("start_date") && body.hasOwnProperty("end_date")) {
    let diffDate = new Date(body.end_date) - new Date(dpTripDetails.start_date);
    if (diffDate <= 0) {
      return {
        continue: false,
        message: "end_date should be greater than start_date",
      };
    }
  }
  if (body.hasOwnProperty("start_date") && !body.hasOwnProperty("end_date")) {
    let diffDate = new Date(dpTripDetails.end_date) - new Date(body.start_date);
    if (diffDate <= 0) {
      return {
        continue: false,
        message: "end_date should be greater than start_date",
      };
    }
  }
  return { continue: true };
};
