const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/signup', async (req, res) => {
    try {
        let { username, email, password } = req.body
        let u = await User.findOne({ email })
        if (u) return res.status(400).json({ msg: 'Email used' })
        let unt = await User.findOne({ username })
        if (unt) return res.status(400).json({ msg: 'Name used' })

        let salt = await bcrypt.genSalt(10)
        let pass = await bcrypt.hash(password, salt)

        let user = new User({ username, email, password: pass })
        await user.save()

        let token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(201).json({ token, user: { id: user.id, username, email } })
    } catch (e) {
        res.status(500).send('bad')
    }
})

router.post('/signin', async (req, res) => {
    try {
        let { username, password } = req.body
        let u = await User.findOne({ username })
        if (!u) return res.status(400).json({ msg: 'No user' })
        let m = await bcrypt.compare(password, u.password)
        if (!m) return res.status(400).json({ msg: 'bad pass' })

        let t = jwt.sign({ user: { id: u.id } }, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.json({ token: t, user: { id: u.id, username: u.username, email: u.email } })
    } catch (e) {
        res.status(500).send('err')
    }
})

module.exports = router
