#! /usr/bin/env node

console.log(
  'This script populates your database with categories as well as items. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");


const categories = [];
const items = [];


const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
 
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name: name, description:description });
  await category.save();
  categories.push(category);
  console.log(`Added genre: ${name} ${description}`);
}

async function itemCreate(name, description, price, stock, category) {
  itemdetail = {name:name, description:description, price:price, stock:stock,category:category};
  /*if (d_birth != false) authordetail.date_of_birth = d_birth;
  if (d_death != false) authordetail.date_of_death = d_death;
  */
  const item = new Item(itemdetail);

  await item.save();
  items.push(item);
  console.log(`Added item: ${name} ${description} ${price} ${stock} ${category}`);
}




async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Clothing", " A category dedicated to various clothing apparel"),
    categoryCreate("Electronics", "Your place for all of your electronic needs"),
    categoryCreate("Digital Media", "Contains an assortment of digital goods"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate("Maroon Button up Shirt", " A maroon long sleeved maroon shirt, perfect for all your cartel needs.","$50", 10, categories[0]),
    itemCreate("Nvidia RTX 4090", "The most powerfull GPU on the market that is most certainly worht the asking price.","$1699", 3, categories[1]),
    itemCreate("Diablo IV", "Turn off your brain and banish demons back to hell for the fourth time and prepare yourself to wait another 10 years for a sequel.","$70", 100, categories[2]),
  ]);
}

/*async function createBooks() {
  console.log("Adding Books");
  await Promise.all([
    bookCreate(
      "The Name of the Wind (The Kingkiller Chronicle, #1)",
      "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
      "9781473211896",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
      "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
      "9788401352836",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "The Slow Regard of Silent Things (Kingkiller Chronicle)",
      "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
      "9780756411336",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "Apes and Angels",
      "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
      "9780765379528",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      "Death Wave",
      "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
      "9780765379504",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      "Test Book 1",
      "Summary of test book 1",
      "ISBN111111",
      authors[4],
      [genres[0], genres[1]]
    ),
    bookCreate(
      "Test Book 2",
      "Summary of test book 2",
      "ISBN222222",
      authors[4],
      false
    ),
  ]);
}
*/
