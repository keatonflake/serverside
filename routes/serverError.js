const express = require("express");
const router = new express.Router();
const errCont = require("../controllers/errController");
const utilities = require("../utilities");

router.get("/trigger", utilities.handleErrors(errCont.triggerError));

module.exports = router;
