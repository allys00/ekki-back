const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const credit_card = require('./routes/credit-card.route');
const account = require('./routes/account.route');
const transfer = require('./routes/transfer.route');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
const dev_db_url = 'mongodb://allys00:ekki321@ds153730.mlab.com:53730/ekki';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
const config = {
  autoIndex: false,
  useNewUrlParser: true,
};
mongoose.connect(mongoDB, { config });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true },
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use('/credit_card', credit_card);
app.use('/account', account);
app.use('/transfer', transfer)

const port = 8000;
app.listen(port, () => {
  console.log('Server is up and running on port numner ' + port);
});