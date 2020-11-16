const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast')

const app = express();
const port = process.env.PORT || 3000;

//Define path for Express config
const publicDirectoryName = path.join(__dirname, '../public');
const viewsPathName = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebar engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPathName);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryName));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Nitish Bharadwaj'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Nitish Bharadwaj'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is some help text',
        title: 'Help',
        name: 'Nitish Bharadwaj'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Please must provide an address!'
        })
    }
    
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({error});
        }
    
        forecast(latitude, longitude, (error, forecatData) => {
            if(error) {
                return res.send({error});
            }
            res.send({
                forecast: forecatData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search);
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        message: 'Help Article Not Found!',
        title: '404',
        name: 'Nitish Bharadwaj'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        message: 'Page Not Found!',
        title: '404',
        name: 'Nitish Bharadwaj'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+ port);
})