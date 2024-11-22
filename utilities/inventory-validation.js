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

    body("inv_image")
      .optional()
      .isURL()
      .withMessage("Please provide a valid image URL"),

    body("inv_thumbnail")
      .optional()
      .isURL()
      .withMessage("Please provide a valid thumbnail URL"),

    body("classification_id")
      .notEmpty()
      .withMessage("Please select a vehicle classification")
      .custom(async (classification_id) => {
        const classificationExists =
          await inventoryModel.checkExistingClassification(classification_id);
        if (!classificationExists) {
          throw new Error(
            "Selected classification is not valid. Please choose a valid classification."
          );
        }
      }),
  ];
};

module.exports = validate;
