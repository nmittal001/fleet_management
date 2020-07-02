const failJson = { success: 0, message: "There was an error!" };
const userModule = require("../modules/user.module");
const tripModule = require("../modules/trip.module");
const createTripValidator = require("../validator/createTripValidator");
const constants = require("../config/constants");
module.exports = {
  configure(app) {
    /**
     * API for getting user information
     */
    app.get("/fleetManagement/getUserProfile", function (req, res) {
      try {
        userModule.getUser(req.decoded, function (result) {
          if (result.rows && result.rows.length == 1) {
            delete result.rows[0].password;
            return res.json({ success: 1, data: result.rows[0] });
          } else {
            return res.json({ success: 0, message: "User not found" });
          }
        });
      } catch (error) {
        console.log(error);
        return res.json(failJson);
      }
    });

    /**
     * API for update user profile
     */
    app.put("/fleetManagement/updateUserProfile", function (req, res) {
      try {
        userModule.updateUserProfile(req.decoded.user_id, req.body, function (
          result
        ) {
          return res.json(result);
        });
      } catch (error) {
        console.log(error);
        return res.json(failJson);
      }
    });

    /**
     * Create Trip
     */
    app.post("/fleetManagement/createTrip", function (req, res) {
      try {
        let validator = createTripValidator.validator(req.body);
        if (!validator.continue) {
          return res.json({ success: 0, message: validator.message });
        }
        req.body.user_id = req.decoded.user_id;
        tripModule.createTrip(req.body, function (result) {
          return res.json(result);
        });
      } catch (error) {
        console.log(error);
        return res.json(failJson);
      }
    });

    /**
     * update Trip information
     */
    app.put("/fleetManagement/updateTrip", function (req, res) {
      try {
        tripModule.updateTrip(
          req.query.trip_id,
          req.decoded.user_id,
          req.body,
          function (result) {
            return res.json(result);
          }
        );
      } catch (error) {
        console.log(error);
        return res.json(failJson);
      }
    });

    /**
     * API for get Trip information
     */
    app.get("/fleetManagement/getTrips", function (req, res) {
      try {
        if (!req.query.hasOwnProperty("trip_time")) {
          return res.json({ success: 0, message: "trip_time is required" });
        }
        if (!constants.TRIP_TIME.includes(req.query.trip_time)) {
          return res.json({
            success: 0,
            message: "trip_time can be ONGOING, UPCOMING, PAST",
          });
        }
        tripModule.getTrips(req, function (result) {
          return res.json(result);
        });
      } catch (error) {
        console.log(error);
        return res.json(failJson);
      }
    });
  },
};
