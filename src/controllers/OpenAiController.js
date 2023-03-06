const { Configuration, OpenAIApi } = require('openai')

const config = new Configuration({
    apiKey: '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',
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
