let constants = require("../config/constants");
module.exports = {
  /**
   * function for validation
   * @param {Object} body
   */
  validator: function (body) {
    const phonePattern = constants.PHONE_NO_PATTERN;
    if (body.hasOwnProperty("first_name")) {
      if (body.first_name.trim().length <= 0) {
        return [false, "first_name is empty"];
      }
    }
    if (body.hasOwnProperty("last_name")) {
      if (body.last_name.trim().length <= 0) {
        return [false, "last_name is empty"];
      }
    }
    if (body.hasOwnProperty("phone_no")) {
      if (
        body.phone_no.trim().length <= 6 ||
        body.phone_no.trim().length >= 15
      ) {
        return [false, "phone_no length should be between 6 to 15"];
      } else if (!body.phone_no.trim().match(phonePattern)) {
        return [false, "phone_no should be digit only"];
      }
    }
    if (body.hasOwnProperty("driver_license")) {
      if (body.driver_license.trim().length <= 0) {
        return [false, "driver_license is empty"];
      }
    }
    return [true, "ok"];
  },
};
