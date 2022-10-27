# Countries Data API using Express
## Libraries used
* Express (API Server)
* Redis (IP Rate Limiting using `redis.expire`)
* i18n-iso-countries (Convert alpha-3 country code to country name)
* moment (Timestamp)
## How to use API

* ### Fetch all countries
    #### `GET /countries` 
    Example: 
    ```
    localhost:3000/countries
    ```
* ### Filter the countries data by
    * ### Language
        #### `GET /countries?lang=value` 
        Example: 
        ```
        localhost:3000/countries?lang=hindi
        ```
    * ### Population
        * Less than given value
            #### `GET /countries?lt=value` 
            Example:
            ```
            localhost:3000/countries?lt=1402112000
            ```
        * Greater than given value
            #### `GET /countries?gt=value` 
            Example:
            ```
            localhost:3000/countries?gt=1402111999
            ```
        * Less than given valueA and greater than given valueB
            #### `GET /countries?lt=valueA&gt=valueB` 
            Example:
            ```
            localhost:3000/countries?lt=1402112000&gt=1402111999
            ```
* ### Fetch a country by name
    ### `GET /countries/country`
    Example:
    ```
    localhost:3000/countries/india
    ```
* ### Fetch all countries who share borders with the queried country
    ### `GET /countries/country/border`
    Example:
    ```
    localhost:3000/countries/india/border
    ```
* ### Add subregion to specific country
    ### `POST /countries/country`
    Body:
    ```
    {
        "subregion":"value"
    }
    ```
    Example
    ```bash
    curl -X POST localhost:3000/countries/india -H 'Content-Type: application/json' -d '{"subregion":"Asia"}'
    ```
* ### Add border country to specific country
    ### `POST /countries/country`
    Body:
    ```
    {
        "border":"value"
    }
    ```
    Example
    ```bash
    curl -X POST localhost:3000/countries/india -H 'Content-Type: application/json' -d '{"border":"USA"}'
    ```

## How to run API 
* Install Redis and Start Redis Server
```bash
npm install && npm start
```

