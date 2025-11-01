const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
module.exports = function (env) {
  return process.env[env];
};
