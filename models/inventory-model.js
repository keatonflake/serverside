const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  let script = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
  console.log("the results from the inv model are:", script.rows); // Log only the rows
  return script;
}

module.exports = { getClassifications };
