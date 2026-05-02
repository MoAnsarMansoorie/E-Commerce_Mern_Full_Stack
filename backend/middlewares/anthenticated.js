import jwt from 'jsonwebtoken';

const authenticated = (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Token not found. Please login first'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; // Attach user info to request
        req.user = { _id: decoded.userId }; // Attach user ID to request
        next();

    } catch (error) {
        console.log('Authentication error:', error);
        return res.status(401).send({
            success: false,
            message: 'Invalid or expired token',
            error
        });
    }
};

export default authenticated;
