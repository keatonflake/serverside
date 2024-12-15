const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processsing the registration"
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

async function accountLogin(req, res) {
  try {
    console.log("Starting accountLogin function");

    let nav = await utilities.getNav();
    console.log("Navigation data retrieved:", nav);

    const { account_email, account_password } = req.body;
    console.log(
      "Received email and password:",
      account_email,
      account_password ? "Password provided" : "No password provided"
    );

    const accountData = await accountModel.getAccountByEmail(account_email);
    console.log("Account data retrieved:", accountData);

    if (!accountData) {
      console.log("No account found for the provided email");
      req.flash("notice", "Sorry, that email does not exist.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
      return;
    }

    if (await bcrypt.compare(account_password, accountData.account_password)) {
      console.log("Password comparison successful");

      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: 3600 * 1000,
        }
      );
      console.log("Access token created:", accessToken);

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
      });
      console.log("JWT cookie set, redirecting to /account/");

      return res.redirect("/account/");
    } else {
      console.log("Password comparison failed");
      req.flash("notice", "Incorrect password.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
      return;
    }
  } catch (error) {
    console.error("Error in accountLogin function:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function buildAccountView(req, res) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "Account",
    nav,
    errors: null,
  });
}

async function buildUpdateView(req, res) {
  let nav = await utilities.getNav();
  let account_id = req.params.id;
  let accountData = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Update Account Details",
    nav,
    account_id: accountData.account_id,
    first_name: accountData.account_firstname,
    last_name: accountData.account_lastname,
    email: accountData.account_email,
    errors: null,
  });
}

async function updateAccountDetails(req, res) {
  let nav = await utilities.getNav();
  const { account_id, first_name, last_name, account_email } = req.body; // Correct destructuring

  try {
    const updateResult = await accountModel.updateAccountDetails(
      account_id,
      first_name,
      last_name,
      account_email
    );

    if (updateResult) {
      req.flash("notice", "Account successfully updated.");
      return res.redirect("/account");
    }

    req.flash("notice", "Sorry, the account update failed.");
    res.status(501).render(`/account/update/${account_id}`, {
      title: "Update Account",
      nav,
      account_id,
      first_name,
      last_name,
      account_email,
      errors: null,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    req.flash("notice", "An error occurred while updating the account.");
    res.status(500).redirect(`/account/update/${account_id}`);
  }
}

module.exports = {
  accountLogin,
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountView,
  buildUpdateView,
  updateAccountDetails,
  // updateAccountPassword,
};
