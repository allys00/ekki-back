const Account = require('../models/account.model');

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
    balance: 0,
    credit: 1000,
    credit_cards: [],
    transfers: [],
    contacts: []
  });
  Account.create(accountData, function (err, account) {
    if (err) {
      return res.status(400).send({ status: 400, data: err })
    } else {
      req.session.userId = account._id;
      return res.status(201).send(removePassword(account))
    }
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
