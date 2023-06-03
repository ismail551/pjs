const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deptSchema = mongoose.Schema(
    {
        Deptname: {
            type: String,
            require: true
        }
  },
  {
    timestamps: true,
  }
);




const Dept = mongoose.model("Departement", deptSchema);
module.exports = Dept;