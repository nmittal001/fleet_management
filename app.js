const express = require("express");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
const Cryptr = require("cryptr");
const constants = require("./config/constants");
const cryptr = new Cryptr(constants.SECRET_KEY);
const db = require("./lib/db.js");
const userModule = require("./modules/user.module");
const fleetManagement = require("./routes/fleetManagement");
const registerValidator = require("./validator/registerValidator");
app.use(bodyparser.json());
db.configure();

/**
 * API testing
 */

app.get("/fleetManagement", function (req, res) {
  console.log("req.url:", req.url);
  res.json({ success: 1, message: "fleetManagement API are working fine" });
});

/**
 * API for register
 */
app.post("/register", function (req, res) {
  try {
    console.log("req.url:", req.url);
    let isValid = registerValidator.validator(req.body);
    if (!isValid[0]) {
      return res.json({ success: 0, message: isValid[1] });
    }
    const encryptedPassword = cryptr.encrypt(req.body.password);
    req.body.password = encryptedPassword;
    userModule.addUser(req.body, function (result) {
      return res.json(result);
    });
  } catch (err) {
    console.log(err);
    return res.json(failJson);
  }
});

/**
 * API for login
 */
app.post("/login", function (req, res) {
  console.log("req.url:", req.url);
  if (!req.body.hasOwnProperty("email")) {
    return res.json({ success: 0, message: "email is required" });
  }
  if (!req.body.hasOwnProperty("password")) {
    return res.json({ success: 0, message: "password is required" });
  }
  let dbEmail = "";
  let dbPassword = "";
  userModule.getUser(req.body, async function (result) {
    if (result.rows && result.rows.length == 1) {
      dbEmail = result.rows[0].email;
      dbPassword = result.rows[0].password;
    } else {
      res.status(401).send({
        success: 0,
        message: "Incorrect username or password",
      });
    }
    const decryptedPassword = cryptr.decrypt(dbPassword);
    if (decryptedPassword === req.body.password) {
      let token = await getJwtToken(dbEmail, result.rows[0].user_id);
      if (token[0]) {
        res.send({
          success: 1,
          message: "Authentication successful!",
          token: token[1],
        });
      } else {
        res.status(401).send({
          success: 0,
          message: "Failed to generate authenticate token.",
        });
      }
    } else {
      res.status(401).send({
        success: 0,
        message: "Incorrect username or password",
      });
    }
  });
});

app.use(function (req, res, next) {
  console.log("req.url:", req.url);
  var token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, constants.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res
          .status(401)
          .send({ success: 0, message: "Failed to authenticate token." });
      } else {
        console.log("decoded", decoded);
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      success: 0,
      message: "token is require",
    });
  }
});

fleetManagement.configure(app);

let server = app.listen(7005, function () {
  console.log("Listening on port " + server.address().port);
});

/**
 * function to generate JWT Token
 * @param {string} email
 * @param {string} user_id
 */
let getJwtToken = (email, user_id) => {
  return new Promise(function (resolve, reject) {
    jwt.sign(
      { email: email, user_id: user_id },
      constants.SECRET_KEY,
      {
        expiresIn: "12h", // expires in 12 hours
      },
      function (err, token) {
        if (err) {
          reject([false, ""]);
        } else {
          resolve([true, token]);
        }
      }
    );
  });
};
