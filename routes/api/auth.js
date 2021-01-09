const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');


// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Removes the password from the request
        res.json(user);
    } catch(err) {
        console.error(err.Message);
        res.status(500).send('Server errror');
    }
});

module.exports = router;