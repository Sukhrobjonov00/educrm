const { SignInValidation } = require("../modules/validations");

module.exports = class UserController {
    static async SignInPostController(req, res, next) {
        try {
            const { username, password } = await SignInValidation(
                req.body,
                res.error
            );
            console.log(username, password);
        } catch (error) {
            next(error);
        }
    }
};
