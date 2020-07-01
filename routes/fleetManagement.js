const failJson = { success: 0, message: "There was an error!" };
const userModule = require("../modules/user.module");
const tripModule = require("../modules/trip.module");
module.exports = {
  configure(app) {
    /**
     * API for getting information of user
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

    app.post("/fleetManagement/createTrip", function (req, res) {
      try {
        let validator = createTripValidatior(req.body);
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
  },
};

var createTripValidatior = (body) => {
  if (!body.hasOwnProperty("source_location"))
    return { continue: false, message: "source_location is mandatory." };
  if (!body.hasOwnProperty("destination_location"))
    return { continue: false, message: "destination_location is mandatory." };
  if (!body.hasOwnProperty("start_date"))
    return { continue: false, message: "start_date is mandatory." };
  if (!body.hasOwnProperty("end_date"))
    return { continue: false, message: "end_date is mandatory." };
  if (!body.hasOwnProperty("purpose_of_visit"))
    return { continue: false, message: "purpose_of_visit is mandatory." };
  if (body.hasOwnProperty("start_date")) {
    let diffDate = new Date(body.start_date) - new Date();
    if (diffDate <= 0) {
      return {
        continue: false,
        message: "start_date is less than present date and time.",
      };
    }
  }
  let diffDate = new Date(body.end_date) - new Date(body.start_date);
  if (diffDate <= 0) {
    return {
      continue: false,
      message: "end_date should be greater than start_date",
    };
  }
  if (body.destination_location === body.source_location) {
    return {
      continue: false,
      message: "destination_location and source_location are same",
    };
  }
  return { continue: true };
};
