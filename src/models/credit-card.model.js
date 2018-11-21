const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account.model')

const CreditCardSchema = new Schema({
  number: { type: String, required: true },
  cvv: { type: String, required: true },
  expiration: { type: Date, required: true },
  credit: { type: Number, required: true },
  flag: { type: String, required: true },
  user_id: { type: Object, required: true },
  invoice: { type: Number, required: true },
});

CreditCardSchema.post('save', function (credit_card, next) {
  Account.findById(credit_card.user_id, function (err, user) {
    if (err) return next(err);
    user.credit_cards.push({ _id: credit_card._id })
    user.save(function (error) {
      next(error);
    })
  })
})


const CreditCard = mongoose.model('creditCard', CreditCardSchema);
module.exports = CreditCard
