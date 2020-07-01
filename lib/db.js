var cassandra = require("cassandra-driver");
var config = require("../config/config"); // get our config file
var client;

module.exports = {
  configure: function () {
    var authProvider = new cassandra.auth.PlainTextAuthProvider(
      config.db.username,
      config.db.password
    );

    var connect = function () {
      client = new cassandra.Client({
        contactPoints: config.db.hosts,
        keyspace: config.db.keyspace,
        authProvider: authProvider,
        localDataCenter: "datacenter1",
      });
    };

    if (client) {
      client.shutdown(function () {
        connect();
      });
    } else {
      connect();
    }
  },

  queryPromise: function (queryStr, params, options) {
    return client.execute(queryStr, params, options);
  },
};
