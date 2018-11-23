const CreditCard = require('../models/credit-card.model');
const Account = require('../models/account.model');


const getNumber = () => {
    const number = Math.floor((Math.random() * 10000) + 1)
    return number > 999 ? number : `0${number}`
}
const getCvv = () => {
    const number = Math.floor((Math.random() * 1000) + 1)
    return number > 99 ? number : `0${number}`
}

const generateCreditCardNumber = () => {
    let value = ''
    for (let x = 1; x <= 4; x++) {
        value += `${getNumber()}${x < 4 ? '-' : ''}`
    }
    return value
}

const getDateExpiration = () => {
    return new Date(new Date().setFullYear(new Date().getFullYear() + 4));
}
exports.create = function (req, res) {
    const credit_card = new CreditCard(
        {
            number: String(generateCreditCardNumber()),
            cvv: String(getCvv()),
            expiration: getDateExpiration(),
            credit: 100000,
            flag: req.body.flag,
            user_id: req.body.user_id,
            invoice: req.body.invoice,
        }
    );
    credit_card.save(function (err, credit_card) {
        if (err) {
            return res.status(400).send(err);
        }
        res.status(200).send(credit_card)
    })
};

exports.details = function (req, res) {
    CreditCard.findById(req.params.id, function (err, credit_card) {
        if (err) res.status(400).send(err);;
        res.status(200).send(credit_card);
    })
};

exports.update = function (req, res) {
    console.log(req.body)
    CreditCard.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, credit_card) {
        if (err) return res.status(400).send(err);
        res.status(200).send('update success');
    });
};

exports.delete = function (req, res) {
    CreditCard.findByIdAndRemove(req.params.id, function (err, credit_card) {
        if (err) return res.status(400).send(err);
        Account.findById(credit_card.user_id, function (err, user) {
            if (err) return next(err);
            const index = user.credit_cards.findIndex(({ _id }) => req.params.id !== _id)
            user.credit_cards.splice(index, 1)
            user.save(function (error) {
                res.send('Deleted successfully!');
            })
        })
    })
};