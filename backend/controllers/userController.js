const asyncHandler = require("express-async-handler")
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken');


const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password, pic, role, PhoneNO, CIN, Address, CodePostal} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name, email, password, pic, role, PhoneNO, CIN, Address, CodePostal
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password, 
            isAdmin: user.isAdmin,
            role: user.role,
            pic: user.pic,
            PhoneNO: user.PhoneNO,
            CodePostal: user.CodePostal,
            CIN: user.CIN,
            Address: user.Address,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Error Occured!');
    }

});



const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  });



  const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.pic = req.body.pic || user.pic;
      user.Address = req.body.Address || user.Address;
      user.PhoneNO = req.body.PhoneNO || user.PhoneNO;
      user.CIN = req.body.CIN || user.CIN;
      user.CodePostal = req.body.CodePostal || user.CodePostal;
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        pic: updatedUser.pic,
        isAdmin: updatedUser.isAdmin,
        role: updatedUser.role,
        PhoneNO: updatedUser.PhoneNO,
        CIN: updatedUser.CIN,
        Address: updatedUser.Address,
        CodePostal: updatedUser.CodePostal,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User Not Found");
    }
  });






  const addManager = asyncHandler(async (req, res) => {
    const {name,email,password,department} = req.body;

    if(!name || !email || !password || !department ){
        res.status(422).json("please fill the data");
    }

    try {
        
        const preuser = await User.findOne({department: department});
        console.log(preuser);

        if(preuser){
            res.status(422).json("this department already has a manager");
        }else{
            const adduser = new User({
                name,email,password,department, role: 'manager'
            });

            await adduser.save();
            res.status(201).json(adduser);
            console.log(adduser);
        }

    } catch (error) {
        res.status(422).json(error);
    }
  });




 

  const getManager = asyncHandler(async (req, res) => {
    try {
      const userdata = await User.find({role: 'manager'});
      res.status(201).json(userdata)
      console.log(userdata);
  } catch (error) {
      res.status(422).json(error);
  }
  });



  const deleteManager = asyncHandler(async (req, res) => {
    try {
      const {id} = req.params;

      const deletuser = await users.findByIdAndDelete({_id:id})
      console.log(deletuser);
      res.status(201).json(deletuser);

  } catch (error) {
      res.status(422).json(error);
  }
  });





  
  module.exports = { deleteManager ,getManager ,authUser, updateUserProfile, registerUser, addManager };