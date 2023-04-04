const express = require("express");
const cors = require("cors");
const toxicity = require("@tensorflow-models/toxicity");
const bodyParser = require("body-parser");
const fs = require("fs");
const tf = require('@tensorflow/tfjs-node');
//const { data } = require("@tensorflow/tfjs");
const { type } = require("os");
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 4000;

let resultFinal;

// var word_list;
// fs.readFile("words.txt", (err, inputD) => {
//   if (err) throw err;
//   word_list = inputD.toString().split("\n");
//   word_list = word_list.map(word => word.toLowerCase()) 
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/classify", (req, res) => {
  let scraped_data = JSON.stringify(req.body);
  //console.log(scraped_data)
  let data = scraped_data.split(",");
  let cleaned_data = [];
  for (let i = 0; i < data.length; i++) {
    new_str = data[i].replace(/<style[^>]*>.*?<\/style>/gms, " ");
    new_str = new_str.replace(/<[^>]*>/gm, " ");
    new_str = new_str.replace(/\\n/gm ,"")
    //new_str = new_str.replace(/[^a-zA-Z\s]/g, " ");
    new_str = new_str.replace(/\s+/g, " ");

    //console.log(new_str)
    if(new_str.length>=1){ cleaned_data.push(new_str) }

    // console.log(new_str)
    // remove non words
    // if (new_str.length >= 1) {
    //   list_wrds = new_str.split(" ");
    //   let clean_str = "";
    //   for (let j = 0; j < list_wrds.length; j++) {
    //     if (
    //       list_wrds[j].length > 0 &&
    //       word_list.includes(list_wrds[j].toLowerCase())
    //     ) {
    //       clean_str += list_wrds[j];
    //       clean_str += " ";
    //     }
    //   }
    //   if (clean_str.length > 1) {
    //     cleaned_data.push(clean_str);
    //   }
    // }
  }
  //console.log("Cleaned_data "+cleaned_data);
  console.log("--------------------");
  console.log("Scraped_data_length: " + scraped_data.length);

  console.log("--------------------");
  console.log("Cleaned_data_length: " + cleaned_data.length);

  resultFinal = removeSentencesOccurMoreThan10(cleaned_data);
  //console.log("Final_data "+resultFinal);
  console.log("--------------------");
  console.log("Final_data_length: " + resultFinal.length);

  const threshold = 0.7;
  toxicity
    .load(threshold)
    .then((model) => {
      return model.classify(resultFinal);
    })
    .then((predictions) => {
      //console.log(predictions);
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
      
      //console.log(trueLabels);
      let finalSentence = new Set()
      trueLabels.forEach(element => {
        finalSentence.add(element.sentence)
      });

      //console.log("Predictions: " + finalSentence)

      let val = finalSentence.values()
      finalSentenceArray = Array.from(val)

console.log("--------------------")
      console.log("Predictions_array: " + finalSentenceArray)

      res.send(finalSentenceArray)
      console.log("SENT")

    });
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
