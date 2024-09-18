const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateCompletion = async (req, res) => {
  try {
    const { prompt, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || 100,
    });
    res.status(200).json(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generating completion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};