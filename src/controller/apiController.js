const { count } = require("console");
var fs = require("fs");
var file = fs.readFileSync('./src/data/countries.json');
var data = JSON.parse(file)
var isoCountries = require("i18n-iso-countries");

const filterByLanguage = (lang) => {
    let output = data.countries.filter(el => (typeof el.languages !== 'undefined') ? Object.values(el.languages).some(item => (item.toLowerCase() === lang.toLowerCase())) : null)
    return output
}

const filterByPopulation = (request, action) => {
    if(action === "gt"){
        let output = data.countries.filter(el => el.population >= request.query.gt)
        return output
    }
    if(action === "lt"){
        let output = data.countries.filter(el => el.population <= request.query.lt)
        return output
    }
    if(action === "both"){
        let output = data.countries.filter(el => (el.population >= request.query.gt && el.population <= request.query.lt ))
        return output
    }
} 

const fetchSpecificCountry = (request, response) => {
    let country = request.params.country;
    let countryData = data.countries.find(el => el.name.toLowerCase() === country.toLowerCase())
    countryData ? response.send(countryData) : response.status(404).send('Country not found')
}

const fetchBorderingCountries = (request, response) => {
    let country = request.params.country;
    let countryData = data.countries.find(el => el.name.toLowerCase() === country.toLowerCase())
    if (countryData) {
        let borderCountries = countryData.borders.map(item => (isoCountries.getName(item, "en")))
        let borderCountriesData = borderCountries.map(item => (data.countries.find(el => el.name.toLowerCase() === item.toLowerCase())))
        response.send(borderCountriesData)
    }
    else{
        response.status(404).send('Country not found')
    }
   
}

const fetchCountries = (request, response) => {
    if(request.query.lang){
        filterdCountries = filterByLanguage(request.query.lang)
        filterdCountries == undefined || filterdCountries.length === 0 ? response.status(404).send('Not found') : response.send(filterdCountries)
    }
    else if (request.query.gt && request.query.lt){
        response.send(filterByPopulation(request, "both"))
    }
    else if(request.query.gt){
        response.send(filterByPopulation(request, "gt"))
    }
    else if(request.query.lt){
        response.send(filterByPopulation(request, "lt"))
    }
    else{
        response.send(data.countries)
    }
}

const updateData = (request, response) => {
    let country = request.params.country;
    let subregion = request.body.subregion;
    let border = request.body.border
    console.log(border)
    if (subregion || border){
        if(subregion){
            data.countries.forEach((item, index)=>{
                if (item.name.toLowerCase() === country.toLowerCase() ){
                    data.countries[index].subregion = [...(Array.isArray(data.countries[index].subregion) ? data.countries[index].subregion : [data.countries[index].subregion]), subregion]
                    fs.writeFileSync('./src/data/countries.json', JSON.stringify(data));
                }
            })
        }
        if(border){
            data.countries.forEach((item, index)=>{
                if (item.name.toLowerCase() === country.toLowerCase() ){
                    data.countries[index].borders = [...(Array.isArray(data.countries[index].borders) ? data.countries[index].borders : [data.countries[index].borders]), border]
                    fs.writeFileSync('./src/data/countries.json', JSON.stringify(data));
                }
            })
        }
        response.status(200).json({status:"Updated"})
    }
    else{
        response.status(500).send('Something went wrong')
    }
}

module.exports = { fetchCountries, fetchSpecificCountry, fetchBorderingCountries, updateData };