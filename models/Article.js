

// Require Mongoose
var mongoose = require('mongoose');

// Create a Schema Class
var Schema = mongoose.Schema;

// Create Article Schema
var ArticleSchema = new Schema({

    // title is a required string
  title: {
    type: String,
    required: true
  },

    // link is a required string
  link: {
    type: String,
    required: true
  },
    // This only saves one note's ObjectId, ref refers to the Note model
  note: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]

});

// Create the Article model with Mongoose
var Article = mongoose.model('Article', ArticleSchema);


// Export the Model
module.exports = Article;