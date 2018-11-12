const Contact = require('../models/contact.model');

exports.contact_create = function (req, res) {
    const contact = new Contact(
        {
            name: req.body.name,
            price: req.body.price
        }
    );
    contact.save(function (err) {
        if (err) return next(err);

        res.status(200).send(
            {
                data: 'Contact Created successfully',
                status: 200
            })
    })
};

exports.contact_details = function (req, res) {
    Contact.findById(req.params.id, function (err, contact) {
        if (err) return next(err);
        res.status(200).send({
            data: contact,
            status: 200
        });
    })
};

exports.contact_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
        if (err) return next(err);
        res.status(200).send({
            data: 'Contact udpated.',
            status: 200
        });
    });
};

exports.contact_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.status(200).send({
            data: 'Deleted successfully!',
            status: 200
        });
    })
};