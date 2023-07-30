const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/signup', viewController.signup);
router.get('/forgotpassword', viewController.forgot);
router.get('/resetpassword/:tokrn', viewController.reset);
router.get('/', viewController.base);
module.exports = router;
