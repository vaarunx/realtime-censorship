const express = require("express");
const cors = require("cors");
const toxicity = require("@tensorflow-models/toxicity");
const bodyParser = require("body-parser");
const fs = require("fs");
const { data } = require("@tensorflow/tfjs");
const { type } = require("os");
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 4000;

let resultFinal;
var word_list;

fs.readFile("words.txt", (err, inputD) => {
  if (err) throw err;
  word_list = inputD.toString().split("\n");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/classify", (req, res) => {
  let scraped_data = JSON.stringify(req.body);
  let data = scraped_data.split(",");
  let cleaned_data = [];
  for (let i = 0; i < data.length; i++) {
    // remove html tags
    new_str = data[i]
      .replace(/<style[^>]*>.*?<\/style>/gms, " ")
      .replace(/<[^>]*>/gm, " ");
    // remove non-alphabets
    new_str = new_str.replace(/[^a-zA-Z\s]/g, " ");
    // remove multiple spaces
    new_str = new_str.replace(/\s+/g, " ");
    // remove non words
    if (new_str.length > 1) {
      list_wrds = new_str.split(" ");
      let clean_str = "";
      for (let j = 0; j < list_wrds.length; j++) {
        if (
          list_wrds[j].length > 1 &&
          word_list.includes(list_wrds[j].toLowerCase())
        ) {
          clean_str += list_wrds[j];
          clean_str += " ";
        }
      }
      if (clean_str.length > 1) {
        cleaned_data.push(clean_str);
      }
    }
  }
  console.log(cleaned_data);

  resultFinal = removeSentencesOccurMoreThan10(cleaned_data);
  console.log("Cleaned_data " + cleaned_data.length);
  console.log("Final " + resultFinal.length);

  const threshold = 0.9;
  toxicity
    .load(threshold)
    .then((model) => {
      return model.classify(resultFinal.slice(0, 15));
    })
    .then((predictions) => {
      console.log(predictions);
      let i = 0;
      let trueLabels = [];
      for (let i = 0; i < predictions.length; i++) {
        for (let j = 0; j < predictions[i].results.length; j++) {
          if (predictions[i].results[j].match === true) {
            let x = {};
            x["sentence"] = resultFinal[j];
            x["label"] = predictions[i].label;
            trueLabels.push(x);
          }
        }
      }
      
      console.log(trueLabels);

      finalSentence = []
      trueLabels.forEach(element => {
        finalSentence.push(element.sentence)
      });

      console.log("FinalSentence " + finalSentence)

      res.send(finalSentence)
      console.log("SENTT")

    });

    // res.send("Senddd")

  // await toxicity()

  // console.log(trueLabels);
});

const removeSentencesOccurMoreThan10 = (arr) => {
  let counts = {};
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let sentence = arr[i];
    if (counts[sentence] === undefined) {
      counts[sentence] = 1;
    } else {
      counts[sentence]++;
    }
    if (counts[sentence] <= 10) {
      result.push(sentence);
    }
  }
  return result;
};

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
