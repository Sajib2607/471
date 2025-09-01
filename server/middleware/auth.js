import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({ success: false, message: "Invalid Token" });
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        
        if (!token) {
            return res.json({ success: false, message: "Invalid Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set user information in request object
        next();
 
    } catch (error) {
        res.json({ success: false, message: "Invalid Token" });
    }
} 

export default auth;