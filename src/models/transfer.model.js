const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account.model')

const TransferSchema = new Schema({
    sender: { type: Object, required: true },
    value: { type: Number, required: true },
    recipient: { type: Object, required: true },
    created_at: { type: Date, required: true },
});

TransferSchema.pre('save', function (next) {
    const transfer = this;
    Account.findById(transfer.sender._id,
        function (err, sender) {
            if (err) return next(err);
            sender.balance -= transfer.value;
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
    Account.findById(transfer.sender._id, function (err, sender) {
        const index = sender.contacts.findIndex(contact => contact._id === transfer.recipient._id)
        if (index < 0) {
            Account.findById(transfer.recipient._id, function (err, recipient) {
                if (err) return next(err)
                sender.contacts.push({ ...transfer.recipient, ...{ email: recipient.email } })
                sender.save(function (err) {
                    next(err);
                })
            })
        } else {
            next();
        }
    })
})

const Transfer = mongoose.model('transfers', TransferSchema);
module.exports = Transfer
