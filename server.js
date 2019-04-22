var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var express = require("express");

var db = require("./models");

var PORT = 3000;

var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/nytimesdb", { useNewUrlParser: true });




axios.get("https://www.nytimes.com/section/technology").then(function(response) {

  // Load the Response into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $(".css-ye6x8s").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).children("div").children("div").children("a").children("h2").text();

    var summary = $(element).children("div").children("div").children("a").children("p").text();


    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = "https://www.nytimes.com" + $(element).children("div").children("div").children("a").attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      summary: summary
    });
console.log(link, title, summary);  
});
db.Article.create(results).then(function (data) {
console.log(data);
})
  // Log the results once you've looped through each of the elements found with cheerio
  
});