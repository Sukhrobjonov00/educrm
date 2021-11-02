const {
    AddTeacherPostController,
    TeacherUpdatePutController,
} = require("../../controllers/TeacherController");
const authMiddleware = require("../../middlewares/authMiddleware");
const permissionMiddleware = require("../../middlewares/permissionMiddleware");

const router = require("express").Router();

router.use([authMiddleware, permissionMiddleware]);

router.post("/", AddTeacherPostController);
router.put("/:teacher_id", TeacherUpdatePutController);
router.get("/");

module.exports = {
    path: "/teachers",
    router,
};
