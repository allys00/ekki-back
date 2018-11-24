const Account = require('../models/account.model');
const transport = require('../app').transport
const nodemailer = require('nodemailer');


exports.register = function (req, res) {

  if (req.body.password !== req.body.passwordConf) {
    let err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  const accountData = new Account({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    balance: 100000,
    credit_cards: [],
    contacts: []
  });
  Account.create(accountData, function (err, account) {
    if (err) {
      return res.status(400).send({ status: 400, data: err })
    } else {
      req.session.userId = account._id;
      return res.status(201).send(account);
    }
  });
}

exports.forgotPassword = function (req, res) {
  console.log(req.body.email)
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d1e0d2595cd78a",
      pass: "180fca721d20e4"
    }
  });

  let mailOptions = {
    from: 'Banco Ekki',
    to: req.body.email,
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}



exports.login = function (req, res, next) {
  Account.authenticate(req.body.email, req.body.password, function (error, account) {
    if (error || !account) {
      return res.status(400).send("wrong email or password")
    } else {
      req.session.userId = account._id;
      return res.status(200).send(account)
    }
  });
}

exports.getUser = function (req, res, next) {
  if (!req.params.id) return res.status(400).send("id inválido")
  Account.findById(req.params.id)
    .exec(function (error, account) {
      if (error) {
        return next(error);
      } else {
        if (account === null) {
          return res.status(400).send("user not found")
        } else {
          let data = account.toObject()
          delete data.password
          return res.status(200).send(data)
        }
      }
    })
}

exports.getUserByEmail = function (req, res, next) {
  Account.findOne({ email: req.params.email })
    .exec(function (error, account) {
      if (error) {
        return next(error);
      } else {
        if (account === null) {
          return res.status(404).send("user not found")
        } else {
          let data = account.toObject()
          delete data.password
          return res.status(200).send(data)
        }
      }
    })
}

exports.hasAuthenticated = function (req, res, next) {
  Account.findById(req.session.userId)
    .exec(function (error, account) {
      if (error) {
        console.log("error", error)
        return next(error);
      } else {
        if (account === null) {
          return res.status(200).send({
            data: "Not Authorization"
          })
        } else {
          return res.send('<h1>Name: </h1>' + account.name + '<h2>Mail: </h2>' + account.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
}

exports.update = function (req, res) {
  Account.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, transfer) {
    if (err) return res.status(400).send(err);
    res.status(200).send(transfer);
  });
};

exports.logout = function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.status(200).send({
          status: 200
        });
      }
    });
  }
}
