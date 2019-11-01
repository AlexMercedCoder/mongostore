const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const methodOverride = require('method-override');
require('dotenv').config();
const mongoose = require('mongoose');
const db = mongoose.connection;
const host= process.env.CLUSTER;
const subdb = 'gastuff';
const dbupdateobject = { useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false}
const moment = require('moment');


/////////////////////
//DATABASE
/////////////////////

// Configuration
const mongoURI = host + subdb;;

// Connect to Mongo
mongoose.connect( mongoURI, dbupdateobject );

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));
db.on( 'open' , ()=>{
  console.log('Connection made!');
});

//Schema
const Products = require('./models/products.js');

/////////////////////////
//RUNTIME DATA
/////////////////////////

/////////////////////
//MIDDLEWARE
/////////////////////
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));


/////////////////////
//Listener
/////////////////////
app.listen(port, () => console.log(`Hello Alex I'm listening on ${port}!`))


/////////////////////
//Root Route
/////////////////////
app.get('/', (req, res) => res.send('the store is at /store'))

/////////////////////
//Static Files
/////////////////////
app.use(express.static('public'));

/////////////////////
//Index Routes
/////////////////////
app.get('/store/', (request, response) => {
    Products.find({}, (error, data)=>{
        response.render('index.ejs', {
            data: data,
            tabTitle: 'Index'
        });
    });
});


/////////////////////
//Create Routes
/////////////////////
app.post('/store/', (req, res) => {
    if (req.body.pw === process.env.PW){
    Products.create(req.body, (error, created)=>{
        res.redirect('/store');
    });}else{
        console.log('wrong password');
        res.redirect('/store');
    }
});

app.get('/store/new', (req, res) => {
    res.render('new.ejs',
        {
            tabTitle: 'Create'
        });
});

/////////////////////
//Show Routes
/////////////////////
app.get('/store/:indexOf', function(req, res){
        Products.findById(req.params.indexOf, (err, foundData)=>{
            res.render('show.ejs', {
                data:foundData,
                tabTitle: 'Show'
            });
        });
    });

/////////////////////
//Delete Route
/////////////////////
app.delete('/store/:indexOf', (req, res) => {
    console.log(req.params.indexOf)
    if (req.body.pw === process.env.PW){
    Products.findByIdAndRemove(req.params.indexOf, (err, data)=>{
        res.redirect('/store');
    });
        }else{
        console.log('wrong password');
        res.redirect('/store');
        }
});

/////////////////////
//Update Routes
/////////////////////
app.get('/store/:indexOf/edit', (req, res)=>{
    Products.findById(req.params.indexOf, (err, foundData)=>{
        res.render(
    		'edit.ejs',
    		{
    			data: foundData,
                tabTitle: 'edit'

    		}
    	);
    });
});

app.put('/store/:indexOf', (req, res) => {
    if (req.body.pw === process.env.PW){
    Products.findByIdAndUpdate(req.params.indexOf, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect('/store');
    });}else{
        console.log('wrong password');
        res.redirect('/store');
    }
});

app.patch('/purchase/:indexOf/:newqty', (req, res) => {
    updateObj = {qty: req.params.newqty};
    console.log(updateObj);
    Products.findByIdAndUpdate(req.params.indexOf, {$set: updateObj}, {new:true}, (err, updatedModel)=>{
        res.redirect('/store');
    });
});
