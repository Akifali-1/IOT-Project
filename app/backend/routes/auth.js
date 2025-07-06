const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Sign Up Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: { id: user.id, role: user.role }, // Include role in payload
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const payload = {
            user: { id: user.id, role: user.role }, // Include role in payload
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, username: user.name });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server error');
    }
});

// Guest Email Verification Route
router.post('/guest_login', async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Guest email verification error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;
