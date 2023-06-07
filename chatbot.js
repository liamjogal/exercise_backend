// const app = require("./server.js");

// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//   apiKey: "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",
// });
// const openai = new OpenAIApi(configuration);

// // const response = await openai.createCompletion({
// //   model: "text-davinci-003",
// //   prompt:
// //     "Create a workout for me. Organize this workout into sets and reps. I have no weights and would like the workout to consist of cardio and abs.\n\nCardio Workout:\n\n-Set 1: 3 minutes of jumping jacks\n-Set 2: 2 minutes of high-knees\n-Set 3: 2 minutes of butt kicks\n-Set 4: 2 minutes of burpees\n-Set 5: 1 minute of mountain climbers\n\nAbs Workout:\n\n-Set 1: 30-second plank\n-Set 2: 20 bicycle crunches\n-Set 3: 20-second side plank (per side)\n-Set 4: 30 reverse crunches\n-Set 5: 20 sitting toe touches",
// //   temperature: 1,
// //   max_tokens: 256,
// //   top_p: 1,
// //   frequency_penalty: 0,
// //   presence_penalty: 0,
// // });

// app.get("/idea", async (req, res) => {
//   const question = req.question;

//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: question,
//     temperature: 1,
//     max_tokens: 256,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//   });

//   console.log(response);
//   res.status(200).send(response);
// });
