const Favorite = require('../models/Favorite');
const History = require('../models/Movies-watched');
const User = require('../models/users');
const {getPhimDetail} = require('../services/phimService');
const moment = require("moment-timezone");

class PersonalController {
    async favorite (req, res){
      try {
        const favorites = await Favorite.find({ userId: req.user.id });
    
        if (!favorites || favorites.length === 0) {
          return res.render('personal/favorite', { favorites: [] });
        }
    
        // Lấy chi tiết phim từ API
        const favoriteMovies = await Promise.all(
          favorites.map(async (favorite) => {
            try {
              const movieData = await getPhimDetail(favorite.slug);
              return movieData.movie; // Giả sử dữ liệu phim nằm trong movie
            } catch (error) {
              console.error(`Lỗi khi lấy phim ${favorite.slug}:`, error);
              return null; // Bỏ qua phim lỗi
            }
          })
        );
        // Lọc bỏ các phim null (nếu có lỗi khi lấy dữ liệu)
        const validMovies = favoriteMovies.filter((movie) => movie !== null);
    
        res.render('personal/favorite', { favorites: validMovies });
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
        res.status(500).render('pages/error', { error: 'Hãy đăng nhập để vào trang yêu thích' });
      }
    }

    async history(req, res) {
      try {
        const histories = await History.find({ userId: req.user.id });
    
        if (!histories || histories.length === 0) {
          return res.render('personal/history', { histories: [] });
        }
    
        // Lấy chi tiết phim từ API
        const historyMovies = await Promise.all(
          histories.map(async (history) => {
            try {
              const movieData = await getPhimDetail(history.slug);
              return movieData.movie; // Giả sử dữ liệu phim nằm trong movie
            } catch (error) {
              console.error(`Lỗi khi lấy phim ${history.slug}:`, error);
              return null; // Bỏ qua phim lỗi
            }
          })
        );
        // Lọc bỏ các phim null (nếu có lỗi khi lấy dữ liệu)
        const validMovies = historyMovies.filter((movie) => movie !== null);
    
        res.render('personal/history', { histories: validMovies });
      } catch (error) {
        console.error('Lỗi khi lấy danh sách lịch sử:', error);
        res.status(500).render('pages/error', { error: 'Hãy đăng nhập để xem lịch sử phim của bạn' });
      }
    }

    async profile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            const utcDate = moment(user.createdAt).tz("Asia/Ho_Chi_Minh").format('HH:mm:ss DD/MM/YYYY');
            res.render('personal/profile', { utcDate });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            res.status(500).render('pages/error', { error: 'Hãy đăng nhập để xem thông tin cá nhân' });
        }
    }

    async Addfavorite(req, res) {
      try{
        const slug = req.params.slug;
        const user = req.user.id;
        const favorite = await Favorite.findOne({ userId: user, slug: slug });
        if (!favorite) {
          await Favorite.create({ userId: user, slug: slug });
        }
        req.session.successMessage = 'Đã thêm vào danh sách yêu thích';
        return res.redirect(`/${slug}`);
      }catch(err){
        console.error(err);
        const slug = req.params.slug;
        req.session.errorMessage = 'Hãy đăng nhập để thực hiện chức năng này';
        return res.redirect(`/${slug}`);
      }
    }

    async deleteFavorite(req, res) {
      try {
        const slug = req.params.slug;
        const user = req.user.id;
        await Favorite.findOneAndDelete({ userId: user, slug: slug });
        // Hiển thị thông báo xóa thành công
        req.session.successMessage = 'Xóa thành công khỏi danh sách yêu thích';
        return res.redirect(`/personal/favorite`);
      } catch (err) {
        console.error(err);
        return res.status(500).render('pages/error', { error: 'Hãy đăng nhập để thực hiện chức năng này' });
      }
    }

    async updateProfile(req, res) {
        try {
            const userData = req.body;
            const userId = req.user.id;
            const updateUser = await User.findByIdAndUpdate(userId, userData);
            if (!updateUser) {
            req.session.errorMessage = 'Cập nhật thông tin thất bại';
            return res.redirect('/personal/profile');
            }
            req.session.successMessage = 'Cập nhật thông tin thành công';
            res.redirect('/personal/profile');
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            req.session.errorMessage = 'Cập nhật thông tin thất bại';
            res.redirect('/personal/profile');
        }
    }

    async updateAvatar(req, res) {
        try {
            const userId = req.user.id;
            const avatarPath = req.file.filename;

            const updateUser = await User.findByIdAndUpdate(userId, { avatar: avatarPath });
            if (!updateUser) {
            req.session.errorMessage = 'Cập nhật ảnh đại diện thất bại';
            return res.redirect('/personal/profile');
            }
            req.session.successMessage = 'Cập nhật ảnh đại diện thành công';
            res.redirect('/personal/profile');
        } catch (error) {
            console.error('Lỗi khi cập nhật ảnh đại diện:', error);
            req.session.errorMessage = 'Cập nhật ảnh đại diện thất bại';
            res.redirect('/personal/profile');
        }
    }
}

module.exports = new PersonalController();
