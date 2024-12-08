const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authorizeRole = (role) => (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.user.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = decoded.user; // Attach user info to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = { authorizeRole };
