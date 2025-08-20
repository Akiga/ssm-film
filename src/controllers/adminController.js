const { getPhimList, getPhimDetail, getChuDe, getFilmCategory, getCountryCategory, search} = require('../services/phimService');
const userModel = require('../models/users');
const filmModel = require('../models/filmed');
const filmForGuestModel = require('../models/filmForGuest');
const moment = require("moment-timezone");
require('dotenv').config();



class adminComtroller {
    async dashboard(req, res) {
        const countUsers = await userModel.countDocuments();
        const startOfDay = moment().tz("Asia/Ho_Chi_Minh").startOf("day").toDate();
        const endOfDay = moment().tz("Asia/Ho_Chi_Minh").endOf("day").toDate();

        // tổng lượt xem hôm nay
        const countFilmsForGuest = await filmForGuestModel.countDocuments({
            watchedAt: { $gte: startOfDay, $lt: endOfDay }
        });
        const countFilmsForUser = await filmModel.countDocuments({
            watchedAt: { $gte: startOfDay, $lt: endOfDay }
        });
        const countFilmed = countFilmsForGuest + countFilmsForUser;

        const countFilmsForGuestAll = await filmForGuestModel.countDocuments();
        const countFilmsForUserAll = await filmModel.countDocuments();
        const countFilmedAll = countFilmsForGuestAll + countFilmsForUserAll;

        // best film cho guest hôm nay
        const bestFilmForGuest = await filmForGuestModel.aggregate([
            { $match: { watchedAt: { $gte: startOfDay, $lt: endOfDay } } },
            { $group: { _id: "$slug", totalViews: { $sum: 1 } } },
            { $sort: { totalViews: -1 } },
            { $limit: 1 }
        ]);

        // best film cho user hôm nay
        const bestFilmForUser = await filmModel.aggregate([
            { $match: { watchedAt: { $gte: startOfDay, $lt: endOfDay } } },
            { $group: { _id: "$slug", totalViews: { $sum: 1 } } },
            { $sort: { totalViews: -1 } },
            { $limit: 1 }
        ]);

        // chọn slug
        let slugFilm = null;
        let totalViewsGuest = bestFilmForGuest.length ? bestFilmForGuest[0].totalViews : 0;
        let totalViewsUser = bestFilmForUser.length ? bestFilmForUser[0].totalViews : 0;

        if (totalViewsGuest > totalViewsUser) {
            slugFilm = bestFilmForGuest[0]._id;
        } else if (totalViewsUser > 0) {
            slugFilm = bestFilmForUser[0]._id;
        }

        // lấy detail
        let detailFilm = null;
        if (slugFilm) {
            detailFilm = await getPhimDetail(slugFilm);
        }

        const userDetail = await userModel.find({}).limit(5).select('-password');

        res.render("admin/dashboard", { countUsers, countFilmed, countFilmedAll, detailFilm, userDetail });
    }


    settings(req, res) {
        res.render('admin/settings');
    }

    users(req, res) {
        res.render('admin/users');
    }

    stats(req, res) {
        res.render('admin/stats');
    }

    comments(req, res) {
        res.render('admin/comments');
    }
}

module.exports = new adminComtroller();