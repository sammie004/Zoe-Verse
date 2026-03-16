// middleware/auth.js
const jwt = require('jsonwebtoken');
const connection = require('../connection/connection'); // your DB connection
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to authenticate token and attach user info to req.user
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No Token Provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = decoded; // decoded contains { id, role, email }
        next();
    });
};

// Middleware to authorize roles
const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};