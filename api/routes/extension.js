
const express = require("express")
const puppeteer = require("puppeteer");
const cherio = require('cherio');
const request = require('request');
var cors = require('cors')
const fs = require('fs');

const router = express.Router()

// Create a Write Stream 
var WriteStream  = fs.createWriteStream("ImagesLink.txt", "UTF-8");

router.get("/", (req, res) => {

    //Images
    url = req.query.url;
    console.log("GET parameter received are: ", url);

//   request(url, (err, resp, html)=>{

//     if(!err && resp.statusCode == 200){
//         console.log("Request was successful ");
        
//         // Define Cherio or $ Object 
//         const $ = cherio.load(html);

//         $("img").each((index, image)=>{

//             var img = $(image).attr('src');
//             var baseUrl = url;
//             var Links = baseUrl + img;
//             WriteStream.write(Links);
//             WriteStream.write("\n");
//         });

//     }else{
//         console.log("Request Failed ");
//     }

// });

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


(async () => {
    // Launch a headless browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // Navigate to the page
    await page.goto(url);
    // Scrape the page
    await scrapePage(page);
    // await scrapeImages(page);


    // Close the browser
    await browser.close();
})();




})


async function scrapePage(page) {
    let itemsText = [];
    let itemsImg = [];
    let pageCount = 1;
    try {
        while (pageCount < 6) {
            // Scroll to the bottom of the page
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            // Wait for new content to load
            // await page.waitFor(1000);

            // Extract the text from the page
            let newItemsText = await page.evaluate(() => {
                let elements = Array.from(document.querySelectorAll('p'));
                
                return elements.map(element => element.innerText);
            });
            itemsText = [...itemsText, ...newItemsText];


            let newItemsImg = await page.evaluate(() => {
                let elements = Array.from(document.querySelectorAll('img'));
                return elements.map(img => img.src);
            });

            itemsImg = [...itemsImg, ...newItemsImg]
            pageCount++;
        }
        console.log("Text Items: ", itemsText);
        console.log("Image Items: ", itemsImg);
    } catch (e) {
        console.log(e);
    }
}



module.exports = router




// const puppeteer = require('puppeteer');

// async function scrapeInfiniteScrollPage(page) {
//     let textItems = [];
//     let imageItems = [];
//     let pageCount = 1;
//     try {
//         while (pageCount < 6) {
//             // Scroll to the bottom of the page
//             await page.evaluate(() => {
//                 window.scrollTo(0, document.body.scrollHeight);
//             });
//             // Wait for new content to load
//             await page.waitFor(1000);

//             // Extract the text from the page
//             let newTextItems = await page.evaluate(() => {
//                 let elements = Array.from(document.querySelectorAll('p'));
//                 return elements.map(element => element.innerText);
//             });
//             textItems = [...textItems, ...newTextItems];

//             // Extract the images from the page
//             let newImageItems = await page.evaluate(() => {
//                 let elements = Array.from(document.querySelectorAll('img'));
//                 return elements.map(img => img.src);
//             });
//             imageItems = [...imageItems, ...newImageItems];
//             pageCount++;
//         }
//         console.log("Text Items: ", textItems);
//         console.log("Image Items: ", imageItems);
//     } catch (e) {
//         console.log(e);
//     }
// }

// (async () => {
//     // Launch a headless browser
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     // Navigate to the page
//     await page.goto('https://example.com/infinite-scroll');
//     // Scrape the page
//     await scrapeInfiniteScrollPage(page);
//     // Close the browser
//     await browser.close();
// })();

