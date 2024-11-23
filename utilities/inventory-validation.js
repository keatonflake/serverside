const utilities = require(".");
const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model");
const validate = {};

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please Provide Classification Name")
      .custom(async (classification_name) => {
        const classificationExists =
          await inventoryModel.checkExistingClassification(classification_name);
        if (classificationExists) {
          throw new Error(
            "Classification exists. Please enter an unique classification."
          );
        }
      }),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }

  next();
};

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle make")
      .isLength({ min: 1 })
      .withMessage("Make cannot be empty"),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle model")
      .isLength({ min: 1 })
      .withMessage("Model cannot be empty"),

    body("inv_year")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Please provide a valid year between 1900 and 2100"),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number"),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide the vehicle color")
      .isLength({ min: 1 })
      .withMessage("Color cannot be empty"),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a vehicle description")
      .isLength({ min: 1 })
      .withMessage("Description cannot be empty"),

    body("inv_image").optional(),

    body("inv_thumbnail").optional(),

    body("classification_id")
      .notEmpty()
      .withMessage("Please select a vehicle classification"),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
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

  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add Inventory",
      nav,
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
    });
    return;
  }

  next();
};

module.exports = validate;
