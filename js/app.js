
// TODO: Might be good to create react typescript application for trip selection 
// TODO: Create periodic work architectural availability, integrate github.io or vercel later 

const axios = require("axios");
const fs = require('fs');

const readFile = async (path) => {
    const data = fs.readFileSync(path, 'utf8');
    return data;
}

const writeFile = (response, path) => {
    const responseData = JSON.stringify(response.data, null, 2); // Pretty-print the JSON response

    // Write the response data to a file
    fs.writeFile(path, responseData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Response data saved to response.json');
        }
    });
}


const main = async () => {

    let key = await readFile(".key");

    let id = await readFile(".id");

    const headers = {
        'authorization': key,
        'accept': 'application/json, text/plain, */*',
        "unit-id": parseInt(id)
    };

    const api_url = await readFile(".api");

    console.log(typeof api_url);

    const params = {
        environment: 'dev',
        userId: '1',
    };

    const payloadData = {
        "searchRoutes": [
            {
                "departureStationId": 98,
                "departureStationName": "ANKARA GAR",
                "arrivalStationId": 1325,
                "arrivalStationName": "İSTANBUL(SÖĞÜTLÜÇEŞME)",
                "departureDate": "09-12-2024 21:00:00"
            }
        ],
        "passengerTypeCounts": [{ "id": 0, "count": 1 }],
        "searchReservation": false
    }

    axios.post(api_url, payloadData, {
        params: params,
        headers: headers
    })
        .then(res => {
            console.log('Response data:', res.data);
            writeFile(res, "response.json");
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
}


main();