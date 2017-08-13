const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  author: {
    firstName: String,
    lastName: String
  },
  content: { type: String, required: true }
});

blogSchema.virtual('fullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.represent = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.fullName,
    created: new Date()
  };
};

const Blogpost = mongoose.model('Blogpost', blogSchema);

module.exports = { Blogpost };
