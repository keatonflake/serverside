const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching id found");
  }
}

async function updateAccountDetails(
  account_id,
  first_name,
  last_name,
  account_email
) {
  console.log("Updating account with data:", {
    account_id,
    first_name,
    last_name,
    account_email,
  });
  try {
    const sql =
      "UPDATE public.accounts SET first_name = $1, last_name = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      first_name,
      last_name,
      account_email,
      account_id,
    ]);
    return data.rows[0]; // Returns the updated account details
  } catch (error) {
    console.error("Error updating account details: " + error);
    throw error; // Rethrow the error for higher-level handling if needed
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccountDetails,
};
