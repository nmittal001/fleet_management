const tripModel = require("../models/trip.model");
const updateTripValidator = require("../validator/updateTripValidator");
const createTripValidator = require("../validator/createTripValidator");
let tripModule = {
  createTrip: async function (body, callback) {
    try {
      let isTripCollide = await isTripCollideFun(body);
      if (isTripCollide) {
        return callback({
          success: 0,
          message: "Trip is colliding with other trip",
        });
      }

      tripModel
        .createTrip(body)
        .then(function (value) {
          if (value) {
            return callback({
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
      let isTripCollide = await isUpdateTripCollideFun(
        body,
        user_id,
        tripDetails.rows[0]
      );
      if (isTripCollide) {
        return callback({
          success: 0,
          message: "Trip is colliding with other trip",
        });
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
        callback({ success: 1, message: value.rows });
      })
      .catch(function (err) {
        console.log(err);
        callback({ success: 0, message: "Fail to get trip" });
      });
  },
};
module.exports = tripModule;

function isTripCollideFun(body) {
  return new Promise(async function (resolve, reject) {
    let startRows = await tripModel.checkCollisionOfDate(
      body.start_date,
      body.user_id
    );
    if (startRows && startRows.rows.length > 0) {
      resolve(true);
    }

    let endRows = await tripModel.checkCollisionOfDate(
      body.end_date,
      body.user_id
    );
    if (endRows && endRows.rows.length > 0) {
      resolve(true);
    }

    let startEndRows = await tripModel.checkCollisionOfStartEndDate(body);
    if (startEndRows && startEndRows.rows.length > 0) {
      resolve(true);
    }
    resolve(false);
  });
}

function isUpdateTripCollideFun(body, user_id, tripDetails) {
  return new Promise(async function (resolve, reject) {
    if (
      !body.hasOwnProperty("start_date") &&
      !body.hasOwnProperty("end_date")
    ) {
      resolve(false);
    }

    if (body.hasOwnProperty("start_date") && body.hasOwnProperty("end_date")) {
      let newBody = { ...body, user_id };
      resolve(await isCollideFun(newBody, tripDetails));
    }

    if (!body.hasOwnProperty("start_date") && body.hasOwnProperty("end_date")) {
      let newBody = { ...body, user_id, ...tripDetails.start_date };
      resolve(await isCollideFun(newBody, tripDetails));
    }

    if (body.hasOwnProperty("start_date") && !body.hasOwnProperty("end_date")) {
      let newBody = { ...body, user_id, ...tripDetails.end_date };
      resolve(await isCollideFun(newBody, tripDetails));
    }
  });
}

function isCollideFun(body, tripDetails) {
  return new Promise(async function (resolve, reject) {
    let isStartDateCollided = false,
      isEndDateCollided = false,
      isStartEndDateCollided = false;
    let startRows = await tripModel.checkCollisionOfDate(
      body.start_date,
      body.user_id
    );

    if (startRows && startRows.rows.length > 0) {
      isStartDateCollided = true;
    }
    if (
      startRows &&
      startRows.rows.length == 1 &&
      startRows.rows[0].id.equals(tripDetails.id)
    ) {
      isStartDateCollided = false;
    }

    let endRows = await tripModel.checkCollisionOfDate(
      body.end_date,
      body.user_id
    );
    if (endRows && endRows.rows.length > 0) {
      isEndDateCollided = true;
    }
    if (
      endRows &&
      endRows.rows.length == 1 &&
      endRows.rows[0].id.equals(tripDetails.id)
    ) {
      isEndDateCollided = false;
    }

    let startEndRows = await tripModel.checkCollisionOfStartEndDate(body);
    if (startEndRows && startEndRows.rows.length > 0) {
      isStartEndDateCollided = true;
    }
    if (
      startEndRows &&
      startEndRows.rows.length == 1 &&
      startEndRows.rows[0].id.equals(tripDetails.id)
    ) {
      isStartEndDateCollided = false;
    }
    if (isStartDateCollided || isEndDateCollided || isStartEndDateCollided) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
