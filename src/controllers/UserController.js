const permissionChecker = require("../helpers/permissionChecker");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const { genHash, compareHash } = require("../modules/bcrypt");
const { createToken } = require("../modules/jwt");
const {
    SignInValidation,
    SignUpValidation,
} = require("../modules/validations");

module.exports = class UserController {
    static async SignInPostController(req, res, next) {
        try {
            const { username, password } = await SignInValidation(
                req.body,
                res.error
            );

            const user = await req.db.users.findOne({
                where: { user_username: username },
                raw: true,
            });

            if (!user) throw new res.error(404, "User not found");

            const isTrust = await compareHash(password, user.user_password);

            if (!isTrust) throw new res.error(400, "Password is invalid");

            await req.db.sessions.destroy({
                where: {
                    session_useragent: req.headers["user-agent"] || "Unknown",
                    user_id: user.user_id,
                },
            });

            const session = await req.db.sessions.create({
                session_useragent: req.headers["user-agent"] || "Unknown",
                user_id: user.user_id,
            });

            const token = await createToken({
                session_id: session.session_id,
            });

            res.status(201).json({
                ok: true,
                message: "Token created successfully",
                data: {
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async CreateUserPostController(req, res, next) {
        try {
            permissionChecker("admin", req.user_permissions, res.error);

            const data = await SignUpValidation(req.body, res.error);

            const user = await req.db.users.create({
                user_name: data.name,
                user_username: data.username,
                user_gender: data.gender,
                user_password: await genHash(data.password),
            });

            res.status(201).json({
                ok: true,
                message: "User created successfully",
            });
        } catch (error) {
            if (error.code === "Validation error") {
                error.code == 400;
                error.message = "Username already exists";
            }
            next(error);
        }
    }
};
