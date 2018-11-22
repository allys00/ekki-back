
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: false,
  },
  balance: {
    type: Number,
    required: true
  },
  credit_cards: {
    type: Array,
    required: true
  },
  contacts: {
    type: Array,
    required: true
  }
});

AccountSchema.statics.authenticate = function (email, password, callback) {
  Account.findOne({ email: email })
    .exec(function (err, accountData) {
      if (err) {
        return callback(err)
      } else if (!accountData) {
        var err = new Error('account not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, accountData.password, function (err, result) {
        if (result === true) {
          let data = accountData.toObject()
          delete data.password
          return callback(null, data);
        } else {
          var err = new Error('wrong password');
          return callback(err);
        }
      })
    });
}


AccountSchema.pre('save', function (next) {
  let account = this;
  Account.findOne({ email: account.email }, function (err, response) {
    if (!response) {
      bcrypt.hash(account.password, 10, function (err, hash) {
        if (err) {
          return next(err);
        }
        account.password = hash;
        delete account.passwordConf
        next();
      })
    } else {
      next();
    }
  })
});

const Account = mongoose.model('accounts', AccountSchema);
module.exports = Account;
