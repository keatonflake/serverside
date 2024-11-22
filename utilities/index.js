const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";

  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul class="list-fix">';
    data.forEach((vehicle) => {
      grid += '<li class="list-fix">';
      grid +=
        '<a href="../../inv/type/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetailsTemp = async function (data) {
  let temp = "";

  if (data) {
    temp += `
    <div class="inventory-details">
      <h2 class="vehicle-title">${data.inv_make} ${data.inv_model} (${
      data.inv_year
    })</h2>
      <img src="${data.inv_image}" alt="${data.inv_color} +" " ${
      data.inv_make
    } ${data.model}" class="vehicle-image">
      <p class="vehicle-description">${data.inv_description}</p>
      <h2 class="vehicle-price">Price: $${(
        data.inv_price || 0
      ).toLocaleString()}</p>
      <h2 class="vehicle-mileage">Mileage: ${
        data.inv_miles ? data.inv_miles.toLocaleString() : "N/A"
      } miles</p>
      <p class="vehicle-color">Color: ${data.inv_color || "N/A"}</p>
      <p class="vehicle-classification">Classification: ${
        data.classification_name || "N/A"
      }</p>
    </div>
  `;
  } else {
    temp += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return temp;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

Util.serverErrors = async function (err, req, res, next, nav) {
  console.error(err.stack);
  res.status(500).render("errors/error", {
    nav,
    title: "500 Error",
    message: "Something went wrong on the server.",
  });
};

module.exports = Util;
