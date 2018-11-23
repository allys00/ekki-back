const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account.model');
const Credit = require('./credit-card.model');


const TransferSchema = new Schema({
  sender: { type: Object, required: true },
  value: { type: Number, required: true },
  recipient: { type: Object, required: true },
  created_at: { type: Date, required: true },
  credit: { type: Object, required: false },
});

TransferSchema.pre('save', function (next) {
  const transfer = this;

  Account.findById(transfer.sender._id,
    function (err, sender) {
      if (err) return next(err);
      let value = transfer.credit ? (transfer.value - transfer.credit.value) : transfer.value
      sender.balance -= value
      sender.save(function (err) {
        if (err) return next(err);
        Account.findById(transfer.recipient._id,
          function (err, recipient) {
            recipient.balance += transfer.value;
            recipient.save(function (err) {
              if (err) return next(err);
              next();
            })
          })
      });
    });
});

TransferSchema.post('save', function (transfer, next) {
  let dateNow = new Date()
  let requestSuccess = 0
  const dateSearch = new Date(dateNow.setMinutes(dateNow.getMinutes() - 2))
  Transfer.find({
    created_at: { $gte: dateSearch }
  }, function (err, transfers) {
    if (transfers[0].toObject()._id.toString() !== transfer.toObject()._id.toString()) {
      let oldTransfer = transfers[0]
      if (transfer.value === oldTransfer.value && transfer.recipient._id === oldTransfer.recipient._id) {
        Account.findById(oldTransfer.recipient._id, function (err, recipient) {
          if (err) return next(err)
          recipient.update({ balance: recipient.balance - oldTransfer.value }, function (err) {
            if (err) return next(err)
            Account.findById(oldTransfer.sender._id, function (err, sender) {
              if (err) return next(err)
              if (oldTransfer.credit) {
                Credit.findById(oldTransfer.credit._id,
                  function (err, credit_card) {
                    credit_card.update({ credit: credit_card.credit + oldTransfer.credit.value },
                      function (err) {
                        if (err) return next(err)
                        sender.update({ balance: sender.balance + (oldTransfer.value - oldTransfer.credit.value) },
                          function (err) {
                            if (err) return next(err)
                            oldTransfer.remove(function (err) {
                              if (err) return next(err)
                              requestSuccess++
                              if (requestSuccess === 2) next()
                            })
                          })
                      })
                  })
              } else {
                sender.update({ balance: sender.balance + oldTransfer.value }, function (err) {
                  oldTransfer.remove(function (err) {
                    if (err) return next(err)
                    requestSuccess++
                    if (requestSuccess === 2) next()
                  })
                })
              }
            })
          })
        })
      }
    }
  })

  if (transfer.credit) {
    Credit.findById(transfer.credit._id, function (err, credit_card) {
      credit_card.update({ credit: credit_card.credit - transfer.credit.value }, function (err, haw) {
        if (err) return next(err)
        if (requestSuccess === 2) next()
      })
    })
  }

  Account.findById(transfer.sender._id, function (err, sender) {
    const index = sender.contacts.findIndex(contact => contact._id === transfer.recipient._id)
    if (index < 0) {
      Account.findById(transfer.recipient._id, function (err, recipient) {
        if (err) return next(err)
        sender.contacts.push({ ...transfer.recipient, ...{ email: recipient.email } })
        sender.save(function (err) {
          if (err) return next(err)
          requestSuccess++
          if (requestSuccess === 2) next()
        })
      })
    } else {
      if (err) return next(err)
      requestSuccess++
      if (requestSuccess === 2) next();
    }
  })
})


const Transfer = mongoose.model('transfers', TransferSchema);
module.exports = Transfer
