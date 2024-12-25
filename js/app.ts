
// TODO: Might be good to create react typescript application for trip selection 
// TODO: Create periodic work architectural availability, integrate github.io or vercel later 

import axios from "axios";
import * as fs from 'fs';
import * as path from "path";
import cfg from "config";
import parser from "./parser";
import { APIResponseData, Availability, BookingCapacity, BookingClass, CabinClass, Car, FareFamily, PricingList, Train, TrainAvailability, TrainLeg } from "./data";
import c from "config";
import { ARRIVAL_STATION_ID, ARRIVAL_STATION_NAME, DEPARTURE_DATE, DEPARTURE_STATION_ID, DEPARTURE_STATION_NAME } from "./config";


const readFile = (filePath: string): any => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } else {
        console.error(`File ${filePath} does not exist.`);
        return null;
    }
}

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

const checkForAvailability = (response: APIResponseData) => {
    response.trainLegs.forEach((trainLeg: TrainLeg) => {
        console.log(`Number of Possible Trains: ${trainLeg.resultCount}`);

        console.log("\tTrain Availabilities:");
        trainLeg.trainAvailabilities.forEach((trainAvailability: TrainAvailability) => {
            console.log(`\t\tTrains:`);
            trainAvailability.trains.forEach((train: Train) => {
                console.log(`\t\t\tTrain Id: ${train.id}`);
                console.log(`\t\t\tTrain Name: ${train.name}`);
                console.log(`\t\t\tTrain Type: ${train.type}`);
                console.log(`\t\t\tTrain Departure Station Id: ${train.departureStationId}`);
                console.log(`\t\t\tTrain Arrival Station Id: ${train.arrivalStationId}`);
                console.log(`\t\t\tTrain Number: ${train.number}`);
                console.log(`\t\t\tCars:`);
                train.cars.forEach((car: Car) => {
                    console.log(`\t\t\t\tCar Id: ${car.id}`);
                    console.log(`\t\t\t\tCar Name: ${car.name}`);
                    console.log(`\t\t\t\tTrain Id: ${car.trainId}`);
                    console.log(`\t\t\t\tTotal Capacity: ${car.capacity}`);
                    car.availabilities.forEach((availability: Availability) => {
                        console.log(`\t\t\t\tTrain Car Id: ${availability.trainCarId}`);
                        console.log(`\t\t\t\tTrain Car Name: ${availability.trainCarName}`);
                        console.log(`\t\t\t\t----Avaiability----: ${availability.availability}`);
                        console.log(`\t\t\t\tPricing List:`);
                        availability.pricingList.forEach((pricingList: PricingList) => {
                            console.log(`\t\t\t\t\tBooking Class:`);
                            const bookingClass: BookingClass = pricingList.bookingClass;
                            console.log(`\t\t\t\t\t\tBooking Class Id: ${bookingClass.id}`);
                            console.log(`\t\t\t\t\t\tBooking Class Code: ${bookingClass.code}`);
                            console.log(`\t\t\t\t\t\tBooking Class Name: ${bookingClass.name}`);
                            const fareFamily: FareFamily = bookingClass.fareFamily;
                            console.log(`\t\t\t\t\t\t\tFare Id: ${fareFamily.id}`);
                            console.log(`\t\t\t\t\t\t\tFare Code: ${fareFamily.name}`);
                        });
                    })
                });
            }) // [0].cars[0].availabilities[0].availability
        });
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
        searchRoutes: [
            {
                departureStationId: DEPARTURE_STATION_ID,
                departureStationName: DEPARTURE_STATION_NAME,
                arrivalStationId: ARRIVAL_STATION_ID,
                arrivalStationName: ARRIVAL_STATION_NAME,
                departureDate: DEPARTURE_DATE
            }
        ],
        passengerTypeCounts: [{ "id": 0, "count": 1 }],
        searchReservation: false
    };


    const filePath = path.join(`./data/${DEPARTURE_DATE.split(" ")[0]}.json`);

    console.log();
    const res = readFile(filePath);
    if (res === null) {
        console.log("File does not exist!");

        axios.post(url, payloadData, {
            params: params,
            headers: headers
        }).then(resp => {
            console.log('Response data:', resp.data);

            const response: APIResponseData = resp.data;
            writeFile(resp, filePath);
            checkForAvailability(response);

        }).catch(error => {
            console.error('Error occurred:', error);
        });
    } else {
        checkForAvailability(res);
    }
    
}


main();