const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
});

const app = express();

const corsOptions = {
  origin: 'https://smart-brain-app-front.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  extended: true }));


app.get('/', (req, res) => { res.send('its working') });
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app is runnin on port ${port}`)
});