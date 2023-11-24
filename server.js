// Import dependencies and Helpers 


const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers/');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({
    helpers
});


// The Sequelize connection is imported

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


// Set PORT variable

const app = express();
const PORT = process.env.PORT || 3001;

// Code pulled from Mini project as a template

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 1000 * 60 * 10, //Checks expiration at 10 minute intervals
    expiration: 1000 *3600                //expire after 1 hour prevent the database from accumulating expired sessions.
  })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// force false prevent dropping and re-creating the tables.

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
