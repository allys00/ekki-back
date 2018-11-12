const CreditCard = require('../models/credit-card.model');

exports.credit_card_create = function (req, res) {
    const credit_card = new CreditCard(
        {
            name: req.body.name,
            price: req.body.price
        }
    );
    credit_card.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Credit Card Created successfully')
    })
};

exports.credit_card_details = function (req, res) {
    CreditCard.findById(req.params.id, function (err, credit_card) {
        if (err) return next(err);
        res.send(credit_card);
    })
};

exports.credit_card_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
        if (err) return next(err);
        res.send('Product udpated.');
    });
};

exports.credit_card_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};