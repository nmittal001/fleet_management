const tripModel = require("../models/trip.model");
const updateTripValidator = require("../validator/updateTripValidator");
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
            callback({ success: 0, message: "Fail to create trip" });
          }
        })
        .catch(function (err) {
          console.log(err);
          callback({ success: 0, message: "Fail to create trip" });
        });
    } catch (e) {
      console.log(e);
      callback({ success: 0, message: "Fail to create trip" });
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
      let validator = updateTripValidator.validator(body, tripDetails.rows[0]);
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
  getTrips: function (req, callback) {
    tripModel
      .getTrips(req.query.trip_time, req.decoded.user_id)
      .then(function (value) {
        console.log("value-->>", value);
        callback({ success: 1, message: value.rows });
      })
      .catch(function (err) {
        console.log(err);
        callback({ success: 0, message: "Fail to get trip" });
      });
  },
};
module.exports = tripModule;
