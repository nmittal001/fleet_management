const constants = require("../config/constants");
module.exports = {
  /**
   * function for validation
   * @param {Object} body
   * @return {Array}
   */
  validator: function (body) {
    if (!body.hasOwnProperty("source_location"))
      return { continue: false, message: "source_location is mandatory." };
    else if (body.source_location.trim().length <= 0)
      return { continue: false, message: "source_location is empty." };

    if (!body.hasOwnProperty("destination_location"))
      return { continue: false, message: "destination_location is mandatory." };
    else if (body.destination_location.trim().length <= 0)
      return { continue: false, message: "destination_location is empty." };

    if (!body.hasOwnProperty("start_date"))
      return { continue: false, message: "start_date is mandatory." };
    else if (body.start_date.trim().length <= 0)
      return { continue: false, message: "start_date is empty." };
    else if (!body.start_date.match(constants.DATE_PATTERN))
      return {
        continue: false,
        message:
          "start_date format should be in ISO (YYYY-MM-DDTHH:MN:SS.MSSZ).",
      };

    if (!body.hasOwnProperty("end_date"))
      return { continue: false, message: "end_date is mandatory." };
    else if (body.end_date.trim().length <= 0)
      return { continue: false, message: "end_date is empty." };
    else if (!body.end_date.match(constants.DATE_PATTERN))
      return {
        continue: false,
        message: "end_date format should be in ISO (YYYY-MM-DDTHH:MN:SS.MSSZ).",
      };

    if (!body.hasOwnProperty("purpose_of_visit"))
      return { continue: false, message: "purpose_of_visit is mandatory." };
    else if (body.purpose_of_visit.trim().length <= 0)
      return { continue: false, message: "purpose_of_visit is empty." };

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
  },
};
