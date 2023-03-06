const { Configuration, OpenAIApi } = require('openai')
require('dotenv').config()

const config = new Configuration({
    apiKey: process.env.CHAT_KEY,
})

const openai = new OpenAIApi(config)

const getMessage = async (req, res) => {
    try {
        const { prompt } = req.body

        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            max_tokens: 512,
            temperature: 0,
            prompt: prompt,
        })

        res.json(completion.data.choices[0].text)
    } catch (error) {
        console.log('api', error)
    }
}

module.exports = { getMessage }
