const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 500 },
  price: {type: String, required: true, maxLength:10},
  stock:{type: String, required:true, maxLength:5},
  category:{type: Schema.Types.ObjectId, ref: "Category", required:true}

})
/* Virtual for author's full name
ItemSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});
*/
// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);
