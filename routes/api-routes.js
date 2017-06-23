// Routes
// ======

//Packages
var request = require("request");
var cheerio = require("cheerio");

//Database Models
var Article = require("../models/Article.js");
var Note = require ("../models/Note.js");

var articleCount = 0;

module.exports = function (app) {


// A GET request to scrape the NYTimes website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        request("https://www.nytimes.com/", function (error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Now, we grab every h2 within an article tag, and do the following:
            $('h2.story-heading').each(function (i, element) {

                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");

                // Using Article model, create a new entry and pass the result object to the entry (title and link)
                var entry = new Article(result);

                // Save the entry to the db
                entry.save(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });
            });
            res.redirect("/");

        });

    });

// Get the articles that were scraped from the mongoDB
    app.get("/articles", function (req, res) {
        // Grab every doc in the Article array
        Article.find({}, function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(doc);
            }
        });
    });

// Grab an article by it's objectId
    app.get("/articles/:id", function (req, res) {
        Article.findOne({"_id": req.params.id})
            .populate("note")
            .exec(function (error, doc) {
                if (error) {
                    console.log(error);
                }
                else {
                    res.json(doc);
                }
            });
    });

// Create a new note or replace an existing one
    app.post("/articles/:id", function (req, res) {

        var newNote = new Note(req.body);
        newNote.save(function (error, doc) {
            if (error) {
                res.send(error);
            } else {
                Article.findOneAndUpdate({'_id': req.params.id}, {"note": doc._id}, {new: true})
                    .exec(function (err, newdoc) {
                        // Send any errors to the browser
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.send(newdoc);
                        }

                    })
            }
        });
    });
};


