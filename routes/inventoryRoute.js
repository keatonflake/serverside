const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invCont.buildByClassificationId)
);
router.get(
  "/type/detail/:invId",
  utilities.handleErrors(invCont.buildByVehicleId)
);

module.exports = router;
