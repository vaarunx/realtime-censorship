const express = require('express')
const cors = require('cors')
const toxicity = require('@tensorflow-models/toxicity')
const bodyParser = require('body-parser')

const app = express();

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.post('/classify', (req, res) => {
    console.log('inside classify')
    let scraped_data = JSON.stringify(req.body);
    const pattern = '/<.*?>/g'
    const pattern1 = '/<style>(.*?)</style>/g'
    finalText = scraped_data.replace(pattern1,"")
    finalText2= finalText.replace(pattern,"")
    console.log(finalText2)
    // model
    const threshold = 0.9;
    toxicity.load(threshold).then(model => {
        const sentences = ['you suck'];
        model.classify(sentences).then(predictions => {
            console.log(predictions);
        });
    });
    // model
    res.send(JSON.stringify(scraped_data))
  })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
