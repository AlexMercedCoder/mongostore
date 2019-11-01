const mongoose = require('mongoose'); //require mongoose package
const Schema = mongoose.Schema; //mongoose has many properties on it.  One is a constructor function for Schemas

const productSchema = new Schema({
	name: String,
    description: String,
    img: String,
    price: Number,
    qty: Number
	}
);

//Creating an Article class -- will be stored in 'articles' collection.  Mongo does this for you automatically
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
