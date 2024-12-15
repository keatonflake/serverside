const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const accountValidate = require("../utilities/account-validation");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountView)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
  (req, res) => {
    res.status(200).send("Login process complete");
  }
);

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get(
  "/update/:id",
  utilities.handleErrors(accountController.buildUpdateView)
);

router.post(
  "/update",
  utilities.handleErrors(accountController.updateAccountDetails)
);

module.exports = router;
