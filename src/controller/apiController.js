const fs = require("fs");
const file = fs.readFileSync('./src/data/countries.json');
const data = JSON.parse(file)
const isoCountries = require("i18n-iso-countries");

const fetchSpecificCountry = (request, response) => {
    var input = request.params.country;
    let country = data.countries.find(el => el.name.toLowerCase() === input.toLowerCase())
    country ? response.send(country) : response.status(404).send('Not found')
}

const fetchBorderingCountries = (request, response) => {
    var input = request.params.country;
    let country = data.countries.find(el => el.name.toLowerCase() === input.toLowerCase())
    if (country) {
        var borderCountriesName = country.borders.map(item => (isoCountries.getName(item, "en")))
        var borderCountries = borderCountriesName.map(item => (data.countries.find(el => el.name.toLowerCase() === item.toLowerCase())))
        response.send(borderCountries)
    }
    else{
        response.status(404).send('Not found')
    }
   
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
    const params = request.params.country;
    if (request.body.subregion){
        data.countries.forEach((item, index)=>{
            if (item.name.toLowerCase() === params.toLowerCase() ){
            data.countries[index].subregion = [...(Array.isArray(data.countries[index].subregion) ? data.countries[index].subregion : [data.countries[index].subregion]), request.body.subregion]
            console.log(data.countries[index])
            fs.writeFileSync('./src/data/countries.json', JSON.stringify(data));
            response.status(200).json({status:"Subregion Updated"})
            }
        })
    }
    else if(request.body.border){
        data.countries.forEach((item, index)=>{
            if (item.name.toLowerCase() === params.toLowerCase() ){
            data.countries[index].borders = [...(Array.isArray(data.countries[index].borders) ? data.countries[index].borders : [data.countries[index].borders]), request.body.border]
            console.log(data.countries[index].borders)
            fs.writeFileSync('./src/data/countries.json', JSON.stringify(data));
            response.status(200).json({status:"Border Updated"})
            }
        })
    }
    else{
        response.status(404).send('Not found')
    }
}

module.exports = { fetchCountries, fetchSpecificCountry, fetchBorderingCountries, updateData };