import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expiration time
    });
}

// routes for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password/email"
            });
        }

        // Create JWT token
        const token = createToken(user._id);

        // Return success response with user details and token
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
        
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
        
    }

}

// routes for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Validate email formatting and strong password
        if(!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }
        if(password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // make password encrypted
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        // Return success response with user details and token
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
        
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }

}

// route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }

        
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


// Social login (Google / Facebook)
const oauthLogin = async (req, res) => {
    try {
        const { provider, idToken, accessToken } = req.body;
        let profile = null;

        if (provider === 'google') {
            // Verify Google idToken
            const { OAuth2Client } = await import('google-auth-library');
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            profile = {
                providerId: payload.sub,
                email: payload.email,
                name: payload.name,
                avatar: payload.picture
            };
        } else if (provider === 'facebook') {
            // Verify Facebook accessToken and fetch profile
            const axios = (await import('axios')).default;
            const fields = 'id,name,email,picture';
            const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`;
            const response = await axios.get(url);
            const data = response.data;
            profile = {
                providerId: data.id,
                email: data.email,
                name: data.name,
                avatar: data.picture?.data?.url || null
            };
        } else {
            return res.status(400).json({ success: false, message: 'Unsupported provider' });
        }

        if (!profile?.email) {
            return res.status(400).json({ success: false, message: 'Email permission is required' });
        }

        // Upsert user
        let user = await userModel.findOne({ email: profile.email });
        if (!user) {
            // create new user
            const newUser = new userModel({
                name: profile.name || 'User',
                email: profile.email,
                password: null,
                provider,
                providerId: profile.providerId,
                avatar: profile.avatar
            });
            user = await newUser.save();
        } else {
            // update provider info if not present
            const updated = {};
            if (!user.provider) updated.provider = provider;
            if (!user.providerId) updated.providerId = profile.providerId;
            if (!user.avatar && profile.avatar) updated.avatar = profile.avatar;
            if (Object.keys(updated).length) {
                await userModel.updateOne({ _id: user._id }, { $set: updated });
            }
        }

        // Create token
        const token = createToken(user._id);

        return res.status(200).json({
            success: true,
            message: 'Social login successful',
            user: { id: user._id, name: user.name, email: user.email },
            token
        });

    } catch (error) {
        console.error('Error in oauthLogin:', error.response?.data || error.message || error);
        return res.status(500).json({ success: false, message: 'Social login failed' });
    }
}

export { loginUser, registerUser, adminLogin, oauthLogin };