const express = require('express');
const router = express.Router();
const adminComtroller = require('../controllers/adminController');

router.get('/dashboard', adminComtroller.dashboard);
router.get('/settings', adminComtroller.settings);
router.get('/users', adminComtroller.users);
router.get('/stats', adminComtroller.stats);
router.get('/comments', adminComtroller.comments);


module.exports = router;