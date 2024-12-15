const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const accountValidate = require("../utilities/account-validation");

// Non-:id routes should be placed first
router.get("/login", utilities.handleErrors(accountController.buildLogin));
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

router.get("/logout", utilities.handleErrors(accountController.logout));

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountView)
);

router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
);
router.post(
  "/update",
  utilities.handleErrors(accountController.updateAccountDetails)
);

router.post("/change-password", accountController.changePassword);

module.exports = router;
