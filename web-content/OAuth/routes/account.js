'use strict';

const express = require('express');
const router = express.Router();

const blizzard = require('../config/blizzard');

router.get('/:origin/user', (req, res) => {
  const origin = req.params.origin;
  const access_token = req.query.access_token;
  const locale = req.query.locale;

  blizzard.account.user({ access_token, origin, locale })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.response.data));
});

router.get('/:origin/wow', (req, res) => {
  const origin = req.params.origin;
  const access_token = req.query.access_token;
  const locale = req.query.locale;

  blizzard.account.wow({ access_token, origin, locale })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.response.data));
});

router.get('/:origin/sc2', (req, res) => {
  const origin = req.params.origin;
  const access_token = req.query.access_token;
  const locale = req.query.locale;

  blizzard.account.sc2({ access_token, origin, locale })
    .then(response => res.json(response.data))
    .catch(err => res.json(err.response.data));
});

module.exports = router;
