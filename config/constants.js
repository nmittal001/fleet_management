var constants = {
  TABLES: {
    USER: "fleet_management.user",
    TRIP: "fleet_management.trip",
  },
  SECRET_KEY: "SecretKeyFleetManagement",
  TRIP_TIME: ["ONGOING", "UPCOMING", "PAST"],
  PAST: "PAST",
  ONGOING: "ONGOING",
  UPCOMING: "UPCOMING",
  DATE_PATTERN: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/,
  EMAIL_PATTERN: /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/gim,
  PHONE_NO_PATTERN: /^(\+)?([ 0-9]){6,15}$/g,
};
module.exports = constants;
