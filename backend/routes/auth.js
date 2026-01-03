const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// signup
router.post('/signup', async (req, res) => {
    try {
        let { username, email, password } = req.body

        // check if user exists
        let exists = await User.findOne({ email })
        if (exists) return res.status(400).json({ msg: 'Email already in use' })

        let nameTaken = await User.findOne({ username })
        if (nameTaken) return res.status(400).json({ msg: 'Username taken' })

        // hash password and save
        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(password, salt)

        let user = new User({ username, email, password: hash })
        await user.save()

        let token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(201).json({ token, user: { id: user.id, username, email } })

    } catch (e) {
        console.log(e)
        res.status(500).send('Server error')
    }
})

// signin
router.post('/signin', async (req, res) => {
    try {
        let { email, password } = req.body

        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ msg: 'User not found' })

        let match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({ msg: 'Wrong password' })

        let token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } })

    } catch (e) {
        console.log(e)
        res.status(500).send('Server error')
    }
})

module.exports = router
