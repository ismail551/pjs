const asyncHandler = require("express-async-handler")
const Department = require('../models/deptModel')

// @desc    Get logged in user notes
// @route   GET /api/notes
// @access  Private
const getDepartments = asyncHandler(async (req, res) => {

    const depts = await Department.find();
    res.json(depts);
});

//@description     Fetch single Note
//@route           GET /api/notes/:id
//@access          Public
const getDepartmentById = asyncHandler(async (req, res) => {
  const dept = await Department.findById(req.params.id);

  if (dept) {
    res.json(dept);
  } else {
    res.status(404).json({ message: "Note not found" });
  }

  res.json(dept);
});

//@description     Create single Note
//@route           GET /api/depts/create
//@access          Private
const CreateDepartment = asyncHandler(async (req, res) => {
  const { Deptname } = req.body;

  const deptExists = await Department.findOne({Deptname});

  if(deptExists) {
    res.status(400);
    throw new Error('Departement already exists');
  }

    if (!Deptname) {
      res.status(400);
      throw new Error("Please Fill all the feilds");
      return;
    } else {
      const dept = new Department({ Deptname });
  
      const createdDepartment = await dept.save();
  
      res.status(201).json(createdDepartment);
    }
  
});

//@description     Delete single Note
//@route           GET /api/depts/:id
//@access          Private
const DeleteDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findById(req.params.id);

  if (dept) {
    await dept.remove();
    res.json({ message: "Department Removed" });
  } else {
    res.status(404);
    throw new Error("Department not Found");
  }
});


module.exports = { getDepartments, getDepartmentById, CreateDepartment, DeleteDepartment};