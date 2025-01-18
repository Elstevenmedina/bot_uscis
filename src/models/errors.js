const mongoose = require("mongoose");
const { Schema } = mongoose;

const errors = new Schema({
  err: { type: String, require: true },
});

module.exports = mongoose.model("errors", errors);
