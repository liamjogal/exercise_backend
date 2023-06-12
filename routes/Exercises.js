const express = require("express");
const userModel = require("../dbconfig/userModel");

var router = express.Router();

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  const body = req.body;

  var name;
  console.log(req);

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
        // res.status(200).send("worked");
        console.log("user");

        userModel.findById(body.id, (err, data) => {
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

            res.status(200).send(data.exercises[data.exercises.length - 1]);
          }
        });
      }
    }
  );
});

router.put("/", async (req, res) => {
  const id = req.body.id;
  const exercise = req.body.exercise;

  userModel
    .findById(id)
    .then((doc) => {
      items = doc.exercises;
      console.log(items);
      for (let index in items) {
        let item = items[index];
        if (item._id.toString() === exercise._id) {
          console.log("worked");
          item.exercise = exercise.exercise;
          item.weight = exercise.weight;
          item.sets = exercise.sets;
          item.reps = exercise.reps;
          item.date = exercise.date;
        }
      }

      doc.save();
      console.log(doc);
      res.status(201).send("worked");
    })
    .catch((err) => {
      console.log("Error didn't work");
      console.log(err);
      res.status(400).send(err);
    });
});

router.delete("/", async (req, res) => {
  console.log(req);
  const id = req.query.id;
  const exercise = JSON.parse(req.query.exercise);

  userModel.updateOne(
    { _id: id },
    { $pull: { exercises: exercise } },
    function (err, doc) {
      if (err) {
        console.log(err);
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

module.exports = router;
