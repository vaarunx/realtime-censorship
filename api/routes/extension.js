
const express = require("express")
const puppeteer = require("puppeteer");
const cherio = require('cherio');
const request = require('request');
const fs = require('fs');

const router = express.Router()

// Create a Write Stream 
var WriteStream  = fs.createWriteStream("ImagesLink.txt", "UTF-8");

router.get("/", (req, res) => {

    //Images
    url = req.query.url;
    console.log("GET parameter received are: ", url);

  request(url, (err, resp, html)=>{

    if(!err && resp.statusCode == 200){
        console.log("Request was successful ");
        
        // Define Cherio or $ Object 
        const $ = cherio.load(html);

        $("img").each((index, image)=>{

            var img = $(image).attr('src');
            var baseUrl = url;
            // var Links = baseUrl + img;
            WriteStream.write(img);
            WriteStream.write("\n");
        });

    }else{
        console.log("Request Failed ");
    }

});

//Text
  
    // (async () => {
    //   const browser = await puppeteer.launch({
    //     headless: false,
    //   });
    //   const page = (await browser.pages())[0];
    //   await page.goto(url);
    //   const extractedText = await page.$eval("*", (el) => el.innerText);
    //   console.log(extractedText);
  
    //   await browser.close();

    //   //Image

    // })();



})

module.exports = router

