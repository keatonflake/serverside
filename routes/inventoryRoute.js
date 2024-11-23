const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const inventoryValidate = require("../utilities/inventory-validation");
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

router.get("/", utilities.handleErrors(invCont.buildManagementView));

router.get(
  "/add-classification",
  utilities.handleErrors(invCont.buildAddClassificationView)
);

router.post(
  "/add-classification",
  inventoryValidate.classificationRules(),
  inventoryValidate.checkClassificationData,
  utilities.handleErrors(invCont.addClassification)
);

router.get(
  "/add-inventory",
  utilities.handleErrors(invCont.buildAddInventoryView)
);

router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invCont.addInventory)
);

module.exports = router;
