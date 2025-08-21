const {getPhimDetail} = require('../services/phimService');
const userModel = require('../models/users');
const filmModel = require('../models/filmed');
const filmForGuestModel = require('../models/filmForGuest');
const moment = require("moment-timezone");
require('dotenv').config();


    async function getViewsByMonth(month, year) {
        const startOfMonth = moment.tz({ year, month: month - 1 }, "Asia/Ho_Chi_Minh").startOf("month").toDate();
        const endOfMonth = moment.tz({ year, month: month - 1 }, "Asia/Ho_Chi_Minh").endOf("month").toDate();

        // guest views
        const guestViews = await filmForGuestModel.countDocuments({
            watchedAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // user views
        const userViews = await filmModel.countDocuments({
            watchedAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        return guestViews + userViews;
    }


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

        // tổng lượt xem tất cả
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

        const userDetail = await userModel.find({ role: 'admin' }).limit(5).select('-password');

        // Thống kê lượt xem theo tháng
        const viewsByMonth = [];
        for (let i = 1; i <= 12; i++) {
            const views = await getViewsByMonth(i, 2025);
            viewsByMonth.push(views);
        }

        res.render("admin/dashboard", { countUsers, countFilmed, countFilmedAll, detailFilm, userDetail, viewsByMonth });
    }


    settings(req, res) {
        res.render('admin/settings');
    }

    async users(req, res) {
        const countUsers = await userModel.countDocuments();
        const userDetail = await userModel.find({}).select('-password');

        res.render('admin/users', {userDetail, countUsers});
    }

    async stats(req, res) {
        const startOfDay = moment().tz("Asia/Ho_Chi_Minh").startOf("year").toDate();
        const endOfDay = moment().tz("Asia/Ho_Chi_Minh").endOf("year").toDate();
        // Lấy view theo tháng
        const viewsByMonth = [];
        for (let i = 1; i <= 12; i++) {
            const views = await getViewsByMonth(i, 2025);
            viewsByMonth.push(views);
        }

        // best film cho guest hôm nay
        const bestFilmForGuest = await filmForGuestModel.aggregate([
            { $match: { watchedAt: { $gte: startOfDay, $lt: endOfDay } } },
            { $group: { _id: "$slug", totalViews: { $sum: 1 } } },
            { $sort: { totalViews: -1 } },
            { $limit: 5 }
        ]);

        const listFilmForGuest = [];
        for (let film of bestFilmForGuest) {
            const detail = await getPhimDetail(film._id);
            listFilmForGuest.push({
                name: detail.movie.name,
                totalViews: film.totalViews
            });
        }

        // best film cho user hôm nay
        const bestFilmForUser = await filmModel.aggregate([
            { $match: { watchedAt: { $gte: startOfDay, $lt: endOfDay } } },
            { $group: { _id: "$slug", totalViews: { $sum: 1 } } },
            { $sort: { totalViews: -1 } },
            { $limit: 5 }
        ]);

        const listFilmForUser = [];
        for (let film of bestFilmForUser) {
            const detail = await getPhimDetail(film._id);
            listFilmForUser.push({
                name: detail.movie.name,
                totalViews: film.totalViews
            });
        }

        res.render('admin/stats', {
            viewsByMonth,
            listFilmForGuest,
            listFilmForUser
        });
    }

    comments(req, res) {
        res.render('admin/comments');
    }
}

module.exports = new adminComtroller();