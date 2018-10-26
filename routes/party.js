const express = require('express');
const router = express.Router();
const helpers = require('../handlers/party');
const { loginRequired, ensureCorrectUser, adminOnly } = require('../middleware/auth')

router.route('/')
  .get(helpers.getParties)

router.route('/:id')
  .all(loginRequired, ensureCorrectUser)
  .put(helpers.leaveParty)
  .post(adminOnly, helpers.createParty)

router.route('/:id/:partyId')
  .all(loginRequired, ensureCorrectUser)
  .post(helpers.joinParty)
  .get(helpers.getParty)
  .put(adminOnly, helpers.updateParty)
  .delete(adminOnly, helpers.deleteParty)

module.exports = router;