const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Chat = require('../models/Chat')

router.post('/save', auth, async (req, res) => {
    try {
        const { chatId, prompt, responses } = req.body
        let c
        if (chatId) {
            c = await Chat.findById(chatId)
            if (!c) return res.status(404).json({ msg: 'no chat' })
            if (c.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'no auth' })
            c.interactions.push({ prompt, responses })
            c.updatedAt = Date.now()
        } else {
            const count = await Chat.countDocuments({ userId: req.user.id })
            if (count >= 7) return res.status(400).json({ msg: 'Limit hit (7)' })
            let t = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt
            c = new Chat({ userId: req.user.id, title: t, interactions: [{ prompt, responses }] })
        }
        await c.save()
        res.json(c)
    } catch (err) {
        res.status(500).send('err')
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const cs = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 })
        res.json(cs)
    } catch (err) {
        res.status(500).send('err')
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const c = await Chat.findById(req.params.id)
        if (!c || c.userId.toString() !== req.user.id) return res.status(404).json({ msg: 'not found' })
        res.json(c)
    } catch (err) {
        res.status(500).send('err')
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const c = await Chat.findById(req.params.id)
        if (!c || c.userId.toString() !== req.user.id) return res.status(404).json({ msg: 'not found' })
        await Chat.deleteOne({ _id: req.params.id })
        res.json({ msg: 'done' })
    } catch (err) {
        res.status(500).send('err')
    }
})

module.exports = router
