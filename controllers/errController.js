const utilities = require("../utilities/");

const errCont = {};

errCont.triggerError = async function (req, res, next) {
  const error = new Error("Intentional Server Error");
  error.status = 500;
  next(error);
};

module.exports = errCont;
