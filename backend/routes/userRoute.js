import { loginUser, registerUser, adminLogin, oauthLogin } from '../controllers/userController.js';

import express from 'express';
const router = express.Router();

// Route for user registerUser
router.post("/register", registerUser);
// Route for user login
router.post("/login", loginUser);
// Route for admin login
router.post("/admin", adminLogin);
// Social OAuth login
router.post('/oauth', oauthLogin);

// Export the router
export default router;