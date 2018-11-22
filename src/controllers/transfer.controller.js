const Transfer = require('../models/transfer.model');

exports.create = function (req, res) {
    const transfer = new Transfer(
        {
            sender: req.body.sender,
            value: req.body.value,
            recipient: req.body.recipient,
            credit: req.body.credit,
            created_at: new Date(),
        }
    );
    transfer.save(function (err, transfer) {
        if (err) {
            console.log(err)
            res.status(400).send(err);
        } else {
            res.status(200).send(transfer);
        }
    })
};

exports.list = function (req, res) {
    Transfer.find({
        $or: [
            { 'sender._id': req.params.id },
            { 'recipient._id': req.params.id }
        ]
    }).sort({ created_at: -1 })
        .exec(function (err, transfers) {
            if (err) {
                res.status(404).send(err);
            } else {
                res.status(200).send(transfers);
            }
        })
}

exports.details = function (req, res) {
    Transfer.findById(req.params.id, function (err, transfer) {
        if (err) return res.status(400).send(err);
        res.status(200).send(transfer);
    })
};

exports.update = function (req, res) {
    Transfer.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, transfer) {
        if (err) return res.status(400).send(err);
        res.status(200).send(transfer);
    });
};

exports.delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return res.status(400).send(err);
        res.status(200).send('Deleted successfully!');
    })
};