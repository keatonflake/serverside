const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByVehicleId = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryById(invId);
  const temp = await utilities.buildDetailsTemp(data);
  let nav = await utilities.getNav();
  const className = data.inv_model;
  res.render("./inventory/vehicle", {
    title: `${data.inv_make} ` + className + ` ${data.inv_year}`,
    nav,
    temp,
  });
};

module.exports = invCont;
