const Account = require('../models/account.model');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');


exports.register = function (req, res) {
  if (req.body.password !== req.body.passwordConf) {
    res.status(400).send("passwords dont match");
  }
  const accountData = new Account({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    balance: 100000,
    credit_cards: [],
    contacts: []
  });
  Account.create(accountData, (err, account) => {
    if (err) {
      return res.status(400).send({ status: 400, data: err })
    } else {
      req.session.userId = account._id;
      return res.status(201).send(account);
    }
  });
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await Account.findOne({ email })
    if (!user) return res.status(404).send("User not found")
    const password = Math.random().toString(36).slice(-8);
    const newPassword = await bcrypt.hash(password, 10);
    await Account.findByIdAndUpdate(user._id, {
      '$set': {
        password: newPassword
      }
    })
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "405f7b250dd909",
        pass: "16dd3740841f21"
      }
    });
    let mailOptions = {
      from: 'ekkibank@gmail.com',
      to: email,
      subject: 'Hello ✔',
      text: `Sua nova senha é : ${password}`,
    };

    transport.sendMail(mailOptions, (error) => {
      if (error) {
        return console.log(error);
      }
      res.status(200).send("Email enviado")
    });
  } catch (err) {
    res.status(400).send("Erro on forgot password, try again")
  }

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
  if (!req.params.id) return res.status(400).send("you need send id")
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
