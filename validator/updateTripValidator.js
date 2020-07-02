module.exports = {
  /**
   * function for validation
   * @param {Object} body
   * @param {Object} dpTripDetails
   */
  validator: function (body, dpTripDetails) {
    const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
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
      if (!body.start_date.match(datePattern))
        return {
          continue: false,
          message:
            "start_date format should be in ISO (YYYY-MM-DDTHH:MN:SS.MSSZ)",
        };
    }

    if (body.hasOwnProperty("end_date")) {
      if (!body.end_date.match(datePattern))
        return {
          continue: false,
          message:
            "end_date format should be in ISO (YYYY-MM-DDTHH:MN:SS.MSSZ)",
        };
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
      let diffDate =
        new Date(body.end_date) - new Date(dpTripDetails.start_date);
      if (diffDate <= 0) {
        return {
          continue: false,
          message: "end_date should be greater than start_date",
        };
      }
    }

    if (body.hasOwnProperty("start_date") && !body.hasOwnProperty("end_date")) {
      let diffDate =
        new Date(dpTripDetails.end_date) - new Date(body.start_date);
      if (diffDate <= 0) {
        return {
          continue: false,
          message: "end_date should be greater than start_date",
        };
      }
    }
    return { continue: true };
  },
};
