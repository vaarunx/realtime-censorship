const express = require("express");
const cors = require("cors");
const toxicity = require("@tensorflow-models/toxicity");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/classify", (req, res) => {
  console.log("inside classify");
  let scraped_data = JSON.stringify(req.body);

  // model
  const threshold = 0.9;
  toxicity.load(threshold).then((model) => {
    const sentences = ["you suck"];
    model.classify(sentences).then((predictions) => {
      console.log(predictions[0].results);
    });
  });

  // let result = scraped_data.replace(/<style[^>]*>.*?<\/style>/gms, ' ').replace(/<[^>]*>/gm, ' ');
  // console.log(typeof(result))
  // let res2 = result.replace(/\s+/g, ' ').trim();
  // let final_res = res2.split(',');
  // console.log(final_res)
  // console.log(final_res.length)
  // console.log(typeof(final_res))

  let result = scraped_data
    .replace(/<style[^>]*>.*?<\/style>/gms, "")
    .replace(/<[^>]*>/gm, "");
  let arr = result.split(/(?=<)|(?<=>)/g);
  console.log(arr);



  console.log(textContent); // Output the list of text content

  // model
  res.send(JSON.stringify(scraped_data));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

{
  /* <p> Strong man and a <b> strong</b> girl </p> */
}
