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

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Clssification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async (req, res) => {
  try {
    const nav = await utilities.getNav();
    const { classification_name } = req.body;

    const postResult = await invModel.addClassification(classification_name);

    if (postResult) {
      req.flash(
        "notice",
        `Congratulations, you added the classification: ${classification_name}.`
      );
      return res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav: await utilities.getNav(),
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, adding the classification failed.");
      return res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: error.message,
    });
  }
};

invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      classificationList,
      errors: null,
    });
  } catch (error) {
    console.error("Error loading inventory form:", error);
    res.status(500).send("Internal Server Error");
  }
};

invCont.addInventory = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const nav = await utilities.getNav();
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id,
    } = req.body;

    const postResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id
    );
    if (postResult) {
      req.flash(
        "notice",
        `Congratulations, you added the inventory item ${inv_year} ${inv_make} ${inv_model}.`
      );
      return res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, adding the inventory item failed.");
      return res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: error.message,
    });
  }
};

module.exports = invCont;
