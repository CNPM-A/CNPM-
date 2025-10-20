module.exports = fn => {
    // Trả về một hàm Express Middleware (req, res, next)
    // return (req, res, next) => {
    //     // Gọi hàm controller (fn) được truyền vào.
    //     // Nếu fn là hàm bất đồng bộ, nó trả về một Promise.
    //     // .catch(next) sẽ bắt mọi lỗi từ Promise đó và chuyển nó đến hàm xử lý lỗi Express.
    //     fn(req, res, next).catch(next);
    // };

    
    // Cach 2
    return async (req, res, next) => {
       try {
            await fn(req,res,next)        
        } catch (error) {
            next(error);
        }
    }
};