require('dotenv').config();
const express = require('express');
const axios = require('axios');
const twilio = require('twilio');

const router = express.Router();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.get('/', (req, res) => {
  res.render('main', { layout: 'index' });
});

router.post('/', (req, res) => {
  client
    .verify
    .services(process.env.TWILIO_VERIFY_SERVICE_ID)
    .verifications
    .create({to: req.body.phone, channel: 'sms'})
    .then(v => {
      res.render('main', { phone:req.body.phone, isSent: true, layout: 'index' });
    })
    .catch(err => {
      console.error(err);
      res.render('main', { error: err,  layout: 'index' });
    });
});

router.post('/check', async (req, res) => {
  client
    .verify
    .services(process.env.TWILIO_VERIFY_SERVICE_ID)
    .verificationChecks
    .create({to: req.body.phone, code: req.body.otp})
    .then(v => {
      if (v.status == 'approved')
        res.render('main', { layout: 'index', check: 'Success' });
      else
        res.render('main', { layout: 'index', isSent: true, phone: req.body.phone, check: 'Failure. Try Again.' });
    })
    .catch(err => {
      console.error(err);
      res.render('main', { layout: 'index', error: err });
    });
});

module.exports = router;
