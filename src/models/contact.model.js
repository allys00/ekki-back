const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
});


module.exports = mongoose.model('contact', ContactSchema);
