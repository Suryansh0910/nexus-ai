const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Chat' },
    interactions: [
        {
            prompt: String,
            responses: {
                gpt: String,
                gemini: String,
                deepseek: String
            },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chat', ChatSchema)
