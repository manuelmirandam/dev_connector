const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Public
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile
            .findOne({ user: req.user.id})
            .populate('user', ['name', 'avatar']);
        
        if (!profile) return res.status(400).json({ msg: 'There is no profile for this user'});

        res.json(profile);
    } catch(err) {
        console.log(err.Message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/profile/
// @desc    Create or update users profile
// @access  Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    
    if (company) profileFields.company = company;
    if (company) profileFields.website = website;
    if (company) profileFields.location = location;
    if (company) profileFields.bio = bio;
    if (company) profileFields.status = status;
    if (company) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (youtube) profileFields.social.twitter = twitter;
    if (youtube) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.instagram = instagram;
    if (youtube) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.find({ user: req.user.id});
        // Update profile
        if (profile.length) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id},
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create a new profile
        profile = new Profile(profileFields);
        
        await profile.save();
        res.json(profile);
    } catch(err) {
        console.log(err.Message);
        res.status(500).send('Server error');
    }

    console.log(profileFields.skills);
});

module.exports = router;