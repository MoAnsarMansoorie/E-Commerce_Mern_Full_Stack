import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Login again."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: token_decoded.id }; // Make sure req.user exists
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Please login to continue."
        });
    }
}

export default authUser;