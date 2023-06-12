const express = require("express");
var router = express.Router();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

router.get("/", async (req, res) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: req.query.req }],
  });

  res.status(200).send(completion.data.choices[0].message);
});

module.exports = router;
