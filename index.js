const fs = require("fs");
const express = require("express");
const isoCountries = require("i18n-iso-countries");
const { apiLogger } = require("./src/middleware/apiLogger");
const { apiRateLimiter } = require("./src/middleware/apiRateLimiter");

const app = express();
app.use(express.json());
app.use(apiLogger());
app.use(apiRateLimiter());

const file = fs.readFileSync('./src/data/countries.json');
const data = JSON.parse(file)


const fetchSpecificCountry = (request, response) => {
    var input = request.params.country;
    let country = data.countries.find(el => el.name.toLowerCase() === input.toLowerCase())
    response.send(country)
}

const fetchBorderingCountries = (request, response) => {
    var input = request.params.country;
    let country = data.countries.find(el => el.name.toLowerCase() === input.toLowerCase())
    var borderCountriesName = country.borders.map(item => (isoCountries.getName(item, "en")))
    var borderCountries = borderCountriesName.map(item => (data.countries.find(el => el.name.toLowerCase() === item.toLowerCase())))
    response.send(borderCountries)
}

const filterByLanguage = (lang) => {
    var output = data.countries.filter(el => (typeof el.languages !== 'undefined') ? Object.values(el.languages).some(item => (item.toLowerCase() === lang.toLowerCase())) : null)
    return output
}

const filterByPopulation = (req, action) => {
    if(action === "gt"){
        var output = data.countries.filter(el => el.population >= req.query.gt)
        return output
    }
    if(action === "lt"){
        var output = data.countries.filter(el => el.population <= req.query.lt)
        return output
    }
    if(action === "both"){
        var output = data.countries.filter(el => (el.population >= req.query.gt && el.population <= req.query.lt ))
        return output
    }
} 

app.get("/countries", (req, res) => {
    if(req.query.lang){
        res.send(filterByLanguage(req.query.lang))
    }
    else if (req.query.gt && req.query.lt){
        res.send(filterByPopulation(req, "both"))
    }
    else if(req.query.gt){
        res.send(filterByPopulation(req, "gt"))
    }
    else if(req.query.lt){
        res.send(filterByPopulation(req, "lt"))
    }

        
    else{
        res.send(data.countries)
    }
})
app.get("/countries/:country", fetchSpecificCountry)
app.get("/countries/:country/border", fetchBorderingCountries)

app.listen(3000, () => console.log("Server is running"));
