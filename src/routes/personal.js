const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');
const upload = require('../middlewares/uploadMiddlewares');

router.get('/favorite', personalController.favorite);

router.get('/history', personalController.history);

router.get('/profile', personalController.profile);

router.get('/favorite/:slug', personalController.Addfavorite);

router.delete('/favorite/:slug', personalController.deleteFavorite);

router.patch('/profile', personalController.updateProfile);

router.post('/profile/avatar', upload.single('avatar'), personalController.updateAvatar);

module.exports = router;