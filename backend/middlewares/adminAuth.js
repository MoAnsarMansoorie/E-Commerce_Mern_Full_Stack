import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => { 
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ message: "Access denied, no token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: "Not Authorized, Login Again " });
        }

        // If everything is fine, proceed to the next middleware or route handler
        next();
        
    } catch (error) {
        console.error("Error in adminAuth middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export default adminAuth;