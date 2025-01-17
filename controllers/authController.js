import { compare } from "bcrypt";
import userModel from "../models/userModer.js"
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken"


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        //validations
        if (!name) {
            return res.send({ message: 'Name is Required' })
        }
        if (!email) {
            return res.send({ message: 'email is Required' })
        }
        if (!password) {
            return res.send({ message: 'password is Required' })
        }
        if (!phone) {
            return res.send({ message: 'phone is Required' })
        }
        if (!address) {
            return res.send({ message: 'address is Required' })
        }
        if (!answer) {
            return res.send({ message: 'answer is Required' })
        }
        //check user
        const exisitingUser = await userModel.findOne({ email })
        //existing user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Register please login',
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({
            name, email, phone, address, password: hashedPassword, answer,
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfull",
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error,
        })
    };
};

//post Login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        //check user 
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registerd'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '20d' });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            //     answer: user.answer
            }, 
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
};
//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Email is required" });
      }
      if (!answer) {
        res.status(400).send({ message: "answer is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModel.findOne({ email, answer });
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };
  

// export const forgotPasswordController = async (req, res) => {
//     try {
//         const [email, answer, newPassword] = req.body
//         if (!email) {
//             res.status(400).send({ message: "email is required" });
//         }
//         if(!answer){
//             res.status(400).send({message: "answer is required"});
//         }
//         if(!newPassword){
//             res.status(400).send({message: "newPassword is required"});
//         }
//         //check
//     const user = await userModel.findOne({ email, answer });
//     //validation
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Wrong Email Or Answer",
//       });
//     }
//     const hashed = await hashPassword(newPassword);
//     await userModel.findByIdAndUpdate(user._id, { password: hashed });
//     res.status(200).send({
//       success: true,
//       message: "Password Reset Successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong",
//       error,
//     });
//   }
// };

        //check
//         const user = await userModel.findOne({email,answer})
//         //validation
//         if(!user){
//             return res.status(404).send({
//                 success:false,
//                 message:"Worng Email, Answer"
//             })
//         }
//         const hashed = await hashedPassword(newPassword)
//         await userModel.findByIdAndUpdate(user._id,{ password: hashed });
//         res.status(200).send({
//             success:true,
//             message:"Password Reset Successfully",
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Something went Worng",
//             error,
//         })
//     }
// };

  

//test controller
export const testController = async (req, res) => {
    try {
        res.send("Protected Routes")
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
}