const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const argon2 = require("argon2");

const app = express();
const port = 4000;
const corsOrigin = {
  origin: "http://localhost:3000", //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));
app.use(express.json());

mongoose.set("strictQuery", true);

const user_uri =
  "mongodb+srv://ljogz:bGl7AhkvCWdXWWPZ@cluster0.i0fm5wf.mongodb.net/User_Info?retryWrites=true&w=majority";
mongoose.connect(user_uri, console.log("Mongodb User_Info connected :)"));

const db = mongoose.connection;

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

const smModel = mongoose.model("smSchema", smSchema, "sminfo");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  privacy: String,
  exercises: [exerciseSchema],
  smInfo: smSchema,
});

const userModel = mongoose.model("userModel", userSchema, "logins");

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

app.get("/exercises", async (req, res) => {
  //console.log(req);
  const query = req.query;
  console.log(query);
  userModel.findById(query.id, (err, data) => {
    console.log(data);
    if (err) {
      res.status(400).send(err);
      return console.log("error");
    }
    if (data == null) {
      res.status(400).send("unknown why response is null");
      return console.log("response null");
    } else {
      console.log(`exercises in ${data.exercises}`);

      res.status(200).send(data.exercises);
    }
  });
});

app.put("/newExercise", async (req, res) => {
  const body = req.body;

  var name;

  userModel.updateOne(
    { _id: body.id },
    { $push: { exercises: body.exercise } },
    function (err, doc) {
      if (err) {
        console.log(`unexpected error`);
        res.status(400).send("error");
        return;
      } else {
        console.log(`added new  exercise`);
        console.log(doc);
        smModel.updateOne(
          { user: body.user },
          { $push: { exercises: body.exercise } },
          function (err, doc) {
            if (err) {
              console.log(`unexpected error`);
              res.status(400).send("error");
              return;
            } else {
              console.log(`added new post `);
              console.log(doc);
              res.status(200).send("worked");
            }
          }
        );
      }
    }
  );
});

app.put("/removeExercise", async (req, res) => {
  const id = req.body.id;
  const exercise = req.body.exercise;

  userModel.updateOne(
    { _id: id },
    { $pull: { exercises: exercise } },
    function (err, doc) {
      if (err) {
        console.log(`unexpected error`);
        res.status(400).send("error");
        return;
      }
      if (doc.modifiedCount != 1) {
        console.log("not deleted");
        res.status(400).send("error not deleted");
      } else {
        console.log(`removed ${doc} exercise`);
        console.log(doc);
        res.status(200).send("worked");
      }
    }
  );
});

app.delete("/deleteProfile", async (req, res) => {
  const id = req.query.id;
  userModel.deleteOne({ _id: id });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
