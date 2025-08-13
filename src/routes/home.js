const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')

router.get('/', homeController.home);

router.get('/list', homeController.list);

router.get('/search', homeController.search);

router.get('/list/:slug', homeController.topic);

router.get('/category/:slug', homeController.category);

router.get('/country/:slug', homeController.country);

router.get('/film/:slug', homeController.watchFilm);

router.get('/:slug', homeController.detail)

router.post('/register', homeController.register);

router.post('/login', homeController.login);

router.post('/logout', homeController.logout);



module.exports = router