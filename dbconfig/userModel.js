const mongoose = require("mongoose");

// mongodb configuration

mongoose.set("strictQuery", true);

const user_uri =
  "mongodb+srv://ljogz:bGl7AhkvCWdXWWPZ@cluster0.i0fm5wf.mongodb.net/User_Info?retryWrites=true&w=majority";
mongoose.connect(user_uri, console.log("Mongodb User_Info connected :)"));

const exerciseSchema = mongoose.Schema({
  date: Date,
  exercise: String,
  weight: Number,
  reps: Number,
  sets: Number,
});

// Shchema and model for intial registration

const smSchema = mongoose.Schema({
  user: String,
  followers: [String],
  following: [String],
  privacy: String,
  bio: String,
  exercise_type: String,
  exercises: [exerciseSchema],
  posts: [String],
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  privacy: String,
  exercises: [exerciseSchema],
  smInfo: smSchema,
});

const userModel = mongoose.model("userModel", userSchema, "logins");

module.exports = userModel;
