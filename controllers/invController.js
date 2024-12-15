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
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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
      locals: {
        inv_make: req.body.inv_make || "",
        inv_model: req.body.inv_model || "",
        inv_year: req.body.inv_year || "",
        inv_description: req.body.inv_description || "",
        inv_image: req.body.inv_image || "/images/no-image.png",
        inv_thumbnail:
          req.body.inv_thumbnail || "/images/no-image-thumbnail.png",
        inv_price: req.body.inv_price || "",
        inv_miles: req.body.inv_miles || "",
        inv_color: req.body.inv_color || "",
      },
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditView = async function (req, res, next) {
  console.log(`req.params.inv_id: ${req.params.inv_id}`);
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  console.log(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.buildDeleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  console.log(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/delete", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
      req.flash("notice", `The vehicle was successfully deleted.`);
      res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList(
        classification_id
      );
      req.flash("notice", "Sorry, the delete failed.");
      res.status(501).render("inventory/delete", {
        title: `Delete ${inv_make} ${inv_model}`,
        nav,
        classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      });
    }
  } catch (error) {
    req.flash("notice", "An error occurred during deletion.");
    res.redirect("/inv/");
  }
};

module.exports = invCont;
