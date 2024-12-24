"use strict";
// TODO: Might be good to create react typescript application for trip selection 
// TODO: Create periodic work architectural availability, integrate github.io or vercel later 
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const config_1 = __importDefault(require("config"));
const writeFile = (response, path) => {
    const responseData = JSON.stringify(response.data, null, 2); // Pretty-print the JSON response
    // Write the response data to a file
    fs.writeFile(path, responseData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
        else {
            console.log('Response data saved to response.json');
        }
    });
};
const main = () => {
    let url = config_1.default.get('api.url');
    let key = config_1.default.get('api.key');
    let id = config_1.default.get('api.id');
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
    };
    axios_1.default.post(url, payloadData, {
        params: params,
        headers: headers
    })
        .then(res => {
        console.log('Response data:', res.data);
        const response = res.data;
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
};
main();
