const authMiddleware = require("../../middlewares/authMiddleware");
const permissionMiddleware = require("../../middlewares/permissionMiddleware");
const expressFileUploadMiddleware = require("express-fileupload");
const {
    CourseCreatePostController,
    CourseGetController,
} = require("../../controllers/CourseController");

const router = require("express").Router();

router.use([authMiddleware, permissionMiddleware]);

router.post(
    "/",
    expressFileUploadMiddleware({
        abortOnLimit: true,
        safeFileNames: true,
    }),
    CourseCreatePostController
);
router.get("/", CourseGetController);
// router.put("/:course_id");
// router.delete("/:teacher_id");
// router.get("/:course_id");

module.exports = {
    path: "/courses",
    router,
};
