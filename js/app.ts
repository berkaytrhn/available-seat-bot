
// TODO: Might be good to create react typescript application for trip selection 
// TODO: Create periodic work architectural availability, integrate github.io or vercel later 

import axios from "axios";
import * as fs from 'fs';
import cfg from "config";
import parser from "./parser";
import { APIResponseData } from "./data";



const writeFile = (response: any, path: any) => {
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


const main = () => {

    let url: any = cfg.get('api.url');
    let key: any = cfg.get('api.key')
    let id: any = cfg.get('api.id')

    const headers = {
        'authorization': key,
        'accept': 'application/json, text/plain, */*',
        "unit-id": parseInt(id)
    };
    console.log(typeof url);

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
                "departureDate": "27-12-2024 00:00:00"
            }
        ],
        "passengerTypeCounts": [{ "id": 0, "count": 1 }],
        "searchReservation": false
    }

    axios.post(url, payloadData, {
        params: params,
        headers: headers
    })
        .then(res => {
            console.log('Response data:', res.data);

            const response: APIResponseData = res.data;
            console.log(response);

            response.trainLegs.forEach((trainLeg) => {
                trainLeg.trainAvailabilities.forEach((trainAvailability) => {
                    console.log(trainAvailability.trains[0].cars[0].availabilities[0].availability);
                });
            });
            writeFile(res, "response.json");
            // parse json with parser
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
}


main();