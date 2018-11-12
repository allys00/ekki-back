const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditCardSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
});


module.exports = mongoose.model('creditCard', CreditCardSchema);
