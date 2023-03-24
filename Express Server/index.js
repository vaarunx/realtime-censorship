const express = require("express");
const cors = require("cors");
const toxicity = require("@tensorflow-models/toxicity");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 4000;

let resultFinal;
let labels;
let model_predictions;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/classify", (req, res) => {
  console.log("inside classify");
  let scraped_data = JSON.stringify(req.body);

  // model

  // let result = scraped_data.replace(/<style[^>]*>.*?<\/style>/gms, ' ').replace(/<[^>]*>/gm, ' ');
  // console.log(typeof(result))
  // let res2 = result.replace(/\s+/g, ' ').trim();
  // let final_res = res2.split(',');

  // console.log(final_res)
  // console.log(final_res.length)
  // console.log(typeof(final_res))

  let result = [];
  let currentString = "";
  let inTag = false;
  for (let i = 0; i < scraped_data.length; i++) {
    if (scraped_data[i] === "<") {
      inTag = true;
      if (currentString !== "" && currentString[0] !== ".") {
        result.push(currentString);
        currentString = "";
      }
    } else if (scraped_data[i] === ">") {
      inTag = false;
    } else if (!inTag) {
      currentString += scraped_data[i];
    }
  }
  if (currentString !== "" && currentString[0] !== ".") {
    result.push(currentString);
  }
  console.log("Just the result " + result.length);

  resultFinal = removeSentencesOccurMoreThan10(result);

  console.log("Final " + resultFinal.length);

  const threshold = 0.9;
  // toxicity.load(threshold).then((model) => {
  //   // const sentences = ["you suck"];
  //   model.classify(resultFinal).then((predictions) => {
  //     // predictions.filter(checkTrue)
  //     // console.log(predictions);
  //     this.model_predictions = predictions;
  //     //console.log(predictions)
  //   });
  // });

  toxicity.load(threshold)
  .then((model) => {
      return model.classify(resultFinal);
  })
  .then((predictions) => {
      console.log(predictions);
      console.log("Result final is " + resultFinal)
      const propertyValues = Object.values(resultFinal);

      console.log(propertyValues[0]);
      console.log(typeof(propertyValues));


      let trueLabels = [];
      console.log("Len " + predictions.length)
      for (let i = 0; i < predictions.length; i++) {
          for (let j = 0; j < predictions[i].results.length; j++) {
              if (predictions[i].results[j].match === true) {
                  trueLabels.push(predictions[i]);
              }
          }
      }
      console.log(trueLabels);

    });
  });

  // labels = Array.from(Array(7), () => new Array(resultFinal.length));
  // for (let i = 0; i < resultFinal.length; i++) {
  //   labels[0][i] = predictions[0].results[i].match;
  //   labels[1][i] = predictions[1].results[i].match;
  //   labels[2][i] = predictions[2].results[i].match;
  //   labels[3][i] = predictions[3].results[i].match;
  //   labels[4][i] = predictions[4].results[i].match;
  //   labels[5][i] = predictions[5].results[i].match;
  //   labels[6][i] = predictions[6].results[i].match;
  // }
  // console.log(labels);



  // console.log("Hello " + predictions[0].results[0])
  // fs.writeFile('output.txt', resultFinal.join('\n'), (err) => {
  //   if (err) throw err;
  //     console.log('The file has been saved!');
  //   });

  // model
  // res.send(JSON.stringify(scraped_data));


// const checkTrue = (predictions) => {
//   return
// }

//console.log(labels)

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

{
  /* <p> Strong man and a <b> strong</b> girl </p> */
}
