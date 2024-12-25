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
const path = __importStar(require("path"));
const config_1 = __importDefault(require("config"));
const config_2 = require("./config");
const readFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    else {
        console.error(`File ${filePath} does not exist.`);
        return null;
    }
};
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
const checkForAvailability = (response) => {
    response.trainLegs.forEach((trainLeg) => {
        console.log(`Number of Possible Trains: ${trainLeg.resultCount}`);
        console.log("\tTrain Availabilities:");
        trainLeg.trainAvailabilities.forEach((trainAvailability) => {
            console.log(`\t\tTrains:`);
            trainAvailability.trains.forEach((train) => {
                console.log(`\t\t\tTrain Id: ${train.id}`);
                console.log(`\t\t\tTrain Name: ${train.name}`);
                console.log(`\t\t\tTrain Type: ${train.type}`);
                console.log(`\t\t\tTrain Departure Station Id: ${train.departureStationId}`);
                console.log(`\t\t\tTrain Arrival Station Id: ${train.arrivalStationId}`);
                console.log(`\t\t\tTrain Number: ${train.number}`);
                console.log(`\t\t\tCars:`);
                train.cars.forEach((car) => {
                    console.log(`\t\t\t\tCar Id: ${car.id}`);
                    console.log(`\t\t\t\tCar Name: ${car.name}`);
                    console.log(`\t\t\t\tTrain Id: ${car.trainId}`);
                    console.log(`\t\t\t\tTotal Capacity: ${car.capacity}`);
                    car.availabilities.forEach((availability) => {
                        console.log(`\t\t\t\tTrain Car Id: ${availability.trainCarId}`);
                        console.log(`\t\t\t\tTrain Car Name: ${availability.trainCarName}`);
                        console.log(`\t\t\t\t----Avaiability----: ${availability.availability}`);
                        console.log(`\t\t\t\tPricing List:`);
                        availability.pricingList.forEach((pricingList) => {
                            console.log(`\t\t\t\t\tBooking Class:`);
                            const bookingClass = pricingList.bookingClass;
                            console.log(`\t\t\t\t\t\tBooking Class Id: ${bookingClass.id}`);
                            console.log(`\t\t\t\t\t\tBooking Class Code: ${bookingClass.code}`);
                            console.log(`\t\t\t\t\t\tBooking Class Name: ${bookingClass.name}`);
                            const fareFamily = bookingClass.fareFamily;
                            console.log(`\t\t\t\t\t\t\tFare Id: ${fareFamily.id}`);
                            console.log(`\t\t\t\t\t\t\tFare Code: ${fareFamily.name}`);
                        });
                    });
                });
            }); // [0].cars[0].availabilities[0].availability
        });
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
        searchRoutes: [
            {
                departureStationId: config_2.DEPARTURE_STATION_ID,
                departureStationName: config_2.DEPARTURE_STATION_NAME,
                arrivalStationId: config_2.ARRIVAL_STATION_ID,
                arrivalStationName: config_2.ARRIVAL_STATION_NAME,
                departureDate: config_2.DEPARTURE_DATE
            }
        ],
        passengerTypeCounts: [{ "id": 0, "count": 1 }],
        searchReservation: false
    };
    const filePath = path.join(`./data/${config_2.DEPARTURE_DATE.split(" ")[0]}.json`);
    console.log();
    const res = readFile(filePath);
    if (res === null) {
        console.log("File does not exist!");
        axios_1.default.post(url, payloadData, {
            params: params,
            headers: headers
        }).then(resp => {
            console.log('Response data:', resp.data);
            const response = resp.data;
            writeFile(resp, filePath);
            checkForAvailability(response);
        }).catch(error => {
            console.error('Error occurred:', error);
        });
    }
    else {
        checkForAvailability(res);
    }
};
main();
