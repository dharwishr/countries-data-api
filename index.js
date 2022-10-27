const express = require("express");

const { apiLogger } = require("./src/middleware/apiLogger");
const { apiRateLimiter } = require("./src/middleware/apiRateLimiter");
const {fetchBorderingCountries, fetchSpecificCountry, fetchCountries, updateData} = require("./src/controller/apiController")

const app = express();

app.use(express.json());
app.use(apiLogger());
app.use(apiRateLimiter());

app.get("/countries", fetchCountries)
app.get("/countries/:country", fetchSpecificCountry)
app.get("/countries/:country/border", fetchBorderingCountries)
app.post("/countries/:country", updateData)
app.get('*', (request, response)=>{response.status(404).send('Not Found')});

app.listen(3000, () => console.log("Server is running"));
