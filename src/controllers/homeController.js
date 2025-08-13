const { getPhimList, getPhimDetail, getChuDe, getFilmCategory, getCountryCategory, search} = require('../services/phimService');
const userModel = require('../models/users');
const filmModel = require('../models/filmed');
const favoriteModel = require('../models/favorite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
class homeController{
    // Trang chủ
    async home(req, res) {
        const movies = await getPhimList();
        res.render('pages/index',{
            movies,
        });
    }
    // Trang danh sách phim
    async list(req, res) {
        const page = parseInt(req.query.page) || 1;
        const movies = await getPhimList(page);
        res.render('pages/listFilm',{
            movies,
            currentPage: page,
            totalPage: movies.pagination.totalPages
        });
    }
    // Chức năng tìm kiếm
    async search(req, res) {
        const q = req.query.keyword;
        const page = parseInt(req.query.page) || 1;
        const movies = await search(q, page);
        res.render('pages/listFilm2',{
            movies,
            currentPage : page,
            totalPage: movies.data.params.pagination.totalPages,
            country: '',
            categori: '',
            chuDe: ''
        });
    }

    // Chủ đề phim như: phim lẻ, phim bộ,...
    async topic(req, res) {
        const page = parseInt(req.query.page) || 1;
        const slug = req.params.slug;
        const movies = await getChuDe(slug, page);
        res.render('pages/listFilm2',{
            movies,
            currentPage: page,
            totalPage: movies.data.params.pagination.totalPages,
            country: '',
            categori: '',
            chuDe: slug
        });
    }

    // Thể loại phim như: hành động,...
    async category(req, res) {
        const page = parseInt(req.query.page) || 1;
        const slug = req.params.slug;
        const movies = await getFilmCategory(slug, page);
        res.render('pages/listFilm2',{
            movies,
            currentPage: page,
            totalPage: movies.data.params.pagination.totalPages,
            categori: slug,
            country: '',
            chuDe: ''
        });
    }

    // Lựa chọn phim theo Quốc Gia
    async country(req, res) {
        const slug = req.params.slug;
        const page = parseInt(req.query.page) || 1;
        const movies = await getCountryCategory(slug, page);
        res.render('pages/listFilm2',{
            movies,
            currentPage: page,
            totalPage: movies.data.params.pagination.totalPages,
            country : slug,
            categori: '',
            chuDe: ''
        });
    }

    // Trang chi tiết phim
    async detail(req, res){
        const userID = req.user ? req.user.id : null;
        const watchedFilm = await favoriteModel.findOne({ userId: userID, slug: req.params.slug });
        const slug = req.params.slug
        const detailFilm = await getPhimDetail(slug)
        res.render('pages/detail',{
            detailFilm,
            watchedFilm
        })
    }

    async watchFilm(req, res) {
        const slug = req.params.slug
        const episode = req.query.tap
        const detailFilm = await getPhimDetail(slug)
        // Lưu thông tin phim đã xem vào cơ sở dữ liệu
        const userId = req.user ? req.user.id : null;
        try {
            const watchedFilm = await filmModel.findOne({ userId: userId, slug: slug });
            if(!watchedFilm) {
                // Nếu phim chưa được lưu, tạo mới
                if (userId) {
                    const watchedFilm = new filmModel({userId: userId, slug: slug,});
                    await watchedFilm.save();
                }
            }
        res.render('pages/film',{
          detailFilm,
          episode
        })
        } catch (error) {
            console.error('Error retrieving user ID:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
    }

    async register(req, res) {
        try {
            const userData = req.body;
            // Hash the password before saving
            userData.password = await bcrypt.hash(userData.password, 10);
            const user = new userModel(userData);
            await user.save();
            req.session.successMessage = 'Đăng ký thành công!';
            req.session.openModal = true;
            res.redirect('/');
        } catch (error) {
            if (error.code === 11000) {
                req.session.errorMessage = 'Email đã được sử dụng, vui lòng thử lại!';
                req.session.openModalRegister = true;
                res.redirect('/');
            }
        }
    }

    async login(req, res) {
        try {
            const userLogin = req.body;

            const user = await userModel.findOne({ 
                email: userLogin.email
            });
            if(user && await bcrypt.compare(userLogin.password, user.password)) {
                const token = jwt.sign({
                    id: user._id
                }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token })
            } else {
                return res.status(200).json({ error: 'Email hoặc mật khẩu không đúng' });
            }
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).render('pages/error', { error: 'Lỗi khi đăng nhập' });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('token');
            res.redirect('/');
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).render('pages/error', { error: 'Lỗi khi đăng xuất' });
        }
    }

}

module.exports = new homeController;