const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  description: { type: String, required: true, maxLength: 500 },
  
});

/* Virtual for author's full name
CategorySchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});
*/
// Virtual for author's URL
CategorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/category/${this._id}`;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);
