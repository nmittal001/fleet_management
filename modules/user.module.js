const userModel = require("../models/user.model");

let userModule = {
  getUser: function (body, callback) {
    userModel
      .getUser(body)
      .then(function (value) {
        callback(value);
      })
      .catch(function (err) {
        console.log(err);
        callback(false);
      });
  },
  addUser: function (body, callback) {
    getUser = userModel.getUser(body).then(function (value) {
      console.log(value);
      if (value && value.rows.length == 0) {
        userModel
          .addUser(body)
          .then(function (value) {
            if (value) {
              callback({ success: 1, message: "User added successfully" });
            } else {
              callback({ success: 0, message: "Fail to add user details" });
            }
          })
          .catch(function (err) {
            console.log(err);
            callback({ success: 0, message: "Fail to add user details" });
          });
      } else {
        callback({
          success: 0,
          message: `Already register with ${body.email} email`,
        });
      }
    });
  },
  updateUserProfile: function (user_id, body, callback) {
    userModel
      .updateUserProfile(user_id, body)
      .then(function (value) {
        if (value) {
          callback({
            success: 1,
            message: "User profile updated successfully",
          });
        } else {
          callback({ success: 0, message: "Fail to update user profile" });
        }
      })
      .catch(function (err) {
        console.log(err);
        callback({ success: 0, message: "Fail to update user profile" });
      });
  },
};

module.exports = userModule;
