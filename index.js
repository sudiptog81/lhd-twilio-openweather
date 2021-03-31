require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');

const routes = require('./routes');

const app = express();

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', handlebars({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
