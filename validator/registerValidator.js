let constants = require("../config/constants");
module.exports = {
  /**
   * function for validation
   * @param {Object} body
   */
  validator: function (body) {
    const emailPattern = constants.EMAIL_PATTERN;
    const phonePattern = constants.PHONE_NO_PATTERN;
    if (!body.hasOwnProperty("email")) {
      return [false, "email is required"];
    } else if (body.email.trim().length <= 0) {
      return [false, "email is empty"];
    } else if (!body.email.match(emailPattern)) {
      return [false, "email is not valid"];
    }
    if (!body.hasOwnProperty("password")) {
      return [false, "password is required"];
    } else if (body.password.trim().length <= 0) {
      return [false, "password is empty"];
    }
    if (!body.hasOwnProperty("first_name")) {
      return [false, "first_name is required"];
    } else if (body.first_name.trim().length <= 0) {
      return [false, "first_name is empty"];
    }
    if (!body.hasOwnProperty("last_name")) {
      return [false, "last_name is required"];
    } else if (body.last_name.trim().length <= 0) {
      return [false, "last_name is empty"];
    }
    if (!body.hasOwnProperty("phone_no")) {
      return [false, "phone_no is required"];
    } else if (
      body.phone_no.trim().length <= 6 ||
      body.phone_no.trim().length >= 15
    ) {
      return [false, "phone_no length should be between 6 to 15"];
    } else if (!body.phone_no.trim().match(phonePattern)) {
      return [false, "phone_no should be digit only"];
    }
    if (!body.hasOwnProperty("driver_license")) {
      return [false, "driver_license is required"];
    } else if (body.driver_license.trim().length <= 0) {
      return [false, "driver_license is empty"];
    }
    return [true, "ok"];
  },
};
