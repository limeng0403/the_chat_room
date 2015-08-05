var formidable = require("formidable");

module.exports = postdata;

function postdata (request, callback) {
  var form = new formidable.IncomingForm();
  form.parse(request, callback);
}
