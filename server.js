const express = require("express");
const cors = require("cors");
const argon2 = require("argon2");
var chatbotRouter = require("./routes/chatbot");
var exercisesRouter = require("./routes/Exercises");
const userModel = require("./dbconfig/userModel");

const app = express();
const port = 4000;
const corsOrigin = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));
app.use(express.json());

// function to register a user
function register(name, passw, privStat) {
  const newUser = new userModel({
    username: name,
    password: passw,
    privacy: privStat,
    exercises: [],
    smInfo: {
      user: name,
      followers: [],
      following: [],
      privacy: privStat,
      bio: "Not added",
      exercise_type: "Not added",
      exercises: [],
      posts: [],
    },
  });
  newUser.save(function (err, model) {
    if (err) console.log(err);
    else console.log(model.username + " was registered");
  });
}

app.post("/create", async (req, res) => {
  let hash;
  const name = req.body.name;
  const password = req.body.password;
  try {
    hash = argon2.hash(password).then((hash) => {
      userModel.findOne({ username: name }).exec((err, person) => {
        if (err) {
          res.status(400);
          return console.log(error);
        }
        if (person != null) {
          //console.log("username already in database");
          res.status(422).send("username already exists");
          return;
        } else {
          register(name, hash, "public");
          console.log("success");
          res.status(201).send("sucess");
          return;
        }
      });
    });
  } catch (err) {
    console.log("ERROR " + err);
    if (err.message.search("duplicate") != -1) {
      res.json("Username taken");
    }
  }
});

app.post("/login", async (req, res) => {
  console.log(req);
  const name = req.body.params.name;
  const password = req.body.params.password;
  console.log(name);
  console.log(password);
  userModel
    .findOne({
      username: name,
    })
    .exec((err, person) => {
      if (err) {
        res.status(400).send(err);
        return console.log("error");
      }
      if (person == null) {
        console.log("invalid login");
        res.status(404).send("username not found");
        return;
      } else {
        console.log(`logged in ${name}`);
        console.log(person);
        if (argon2.verify(person.password, password)) {
          delete person.password;
          res.json(person);
        } else {
          res.json("Password incorrect");
        }
      }
    });
});

app.use("/exercises", exercisesRouter);
app.use("/idea", chatbotRouter);

app.delete("/deleteProfile", async (req, res) => {
  const id = req.query.id;
  userModel.deleteOne({ _id: id });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
