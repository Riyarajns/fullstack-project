import express from 'express'
import {registerController, loginController, testController, forgotPasswordController} from "../controllers/authController.js";
import { isAdmin, RequiredSignIn } from '../middlewares/authMiddleware.js';

//router object
const router = express.Router();

//Register || METHOD POST
router.post('/register',registerController);
// Login || Post
router.post('/login', loginController);

//Forgot password || post
router.post("/forgot-password", forgotPasswordController)

//test routes
router.get('/test',RequiredSignIn, isAdmin, testController);

//protected  user route auth
router.get("/user-auth", RequiredSignIn, (req, res) => {
    res.status(200).send({ ok:true });
});

//protected Admin route auth
router.get("/admin-auth", RequiredSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok:true });
});


export default router