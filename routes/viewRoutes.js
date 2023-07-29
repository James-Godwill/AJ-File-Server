const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/signup', viewController.signup);
router.get('/', viewController.base);
module.exports = router;
