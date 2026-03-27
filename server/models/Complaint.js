const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Pending"
  },
  images: [String],
});

module.exports = mongoose.model("Complaint", complaintSchema);