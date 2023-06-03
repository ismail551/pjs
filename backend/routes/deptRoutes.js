const express = require('express');
const {  getDepartments, getDepartmentById, CreateDepartment, DeleteDepartment } = require('../controllers/departmentController')
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware')

router.route("/").get(protect, getDepartments);
router
  .route("/:id")
  .get(getDepartmentById)
  .delete(protect, DeleteDepartment);
router.route("/create").post(protect, CreateDepartment);

module.exports = router;
