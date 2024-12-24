export interface StationStatus{
    id: number;
    name: any;
    detail: any;
}

export interface StationType{
    id: number;
    name: any;
    detail: any;
}


export interface Station{
    id: number;
    stationNumber: string;
    areaCode: number;
    name: string;
    stationStatus: StationStatus;
    stationType: StationType;  
    unitId: number;
    cityId: number;
    districtId: number;
    neighbourhoodId: number;
    uicCode: any;
    technicalUnit: string;
    stationChefId: number;
    detail: string;
    showOnQuery: boolean;
    passengerDrop: boolean;
    ticketSaleActive: boolean;
    active: boolean;
    email: string;
    orangeDeskEmail: string;
    address: string;
    longitude: number;
    latitude: number;
    altitude: number;
    startKm: number;
    endKm: number;
    showOnMap: boolean;
    passengerAdmission: boolean;
    disabledAccessibility: boolean;
    phones: any;
    workingDays: any;
    hardwares: any;
    physicalProperties: any;
    stationPlatforms: any;
    salesChannels: any;
    IATACode: any;
}

export interface SubSegment{
    id: number;
    name: string;
    departureStation: Station;
    arrivalStation: Station;   
    lineId: number;
    lineOrder: number;    
}

export interface Segment{
    id: number;
    departureTime: number;
    arrivalTime: number;
    stops: boolean,
    duration: number,
    stopDuration: number,
    distance: number,
    segment: SubSegment;
}

export interface BookingCapacity{
    id: number;
    trainId: number;
    bookingClassId: number;
    capacity: number;
}

export interface MinPrice{
    type: any;
    priceAmount: number;
    priceCurrency: string;
}

export interface CabinClass{
    id: number;
    code: string;
    name: string;
    additionalServices: any;
    bookingClassModels: any;
    showAvailabilityOnQuery: boolean;
}

export interface FareFamily{
    id: number;
    name: string;
}

export interface BookingClass{
    id: number,
    code: string,
    name: string,
    cabinClass: CabinClass;
    fareFamily: FareFamily;
}

export interface Price{
    type: any;
    priceAmount: number;
    priceCurrency: string;
}

export interface FareBasis{
    code: string;
    factor: number;
    price: Price;
}

export interface PricingList{
    basePricingId: number;
    bookingClass: BookingClass;
    cabinClassId: number;
    basePricingType: string;
    fareBasis: FareBasis;
    basePrice: Price;
    crudePrice: Price;
    baseTransportationCost: Price;
    availability: number;
}

export interface Availability{
    trainCarId: number;
    trainCarName: any;
    cabinClass: CabinClass;
    availability: number,
    pricingList: PricingList[];
    additionalServices: any[]
}

export interface Car{
    id: number;
    name: string;
    trainId: number;
    templateId: number;
    carIndex: number;
    unlabeled: boolean;
    capacity: number;
    cabinClassId: number;
    availabilities: Availability[];
}

export interface TrainSegment{
    departureStationId: number;
    arrivalStationId: number;
    departureTime: string;
    arrivalTime: string;
}

export interface BookingClassAvailability{
    bookingClass: BookingClass;
    price: number;
    availability: number;
}

export interface FareCabinClass{
    cabinClass: CabinClass;
    availabilityCount: number;
    minPrice: number;
    bookingClassAvailabilities: BookingClassAvailability[];
}

export interface AvailableFareInfo{
    
    fareFamily: FareFamily;
    cabinClasses: FareCabinClass[];
}

export interface CabinClassAvailability{
    cabinClass: CabinClass;
    availabilityCount: number;
}

export interface Train{
    id: number; // train id
    number: string; // train number
    name: string; // train name
    commercialName: string; // train commercial name
    type: string;
    line: any;
    reversed: boolean;
    scheduleId: number;
    departureStationId: number;
    arrivalStationId: number;
    minPrice: MinPrice;
    reservationLockTime: number;
    reservable: boolean;
    bookingClassCapacities: BookingCapacity[];
    segments: Segment[];
    cars: Car[];
    trainSegments: TrainSegment[];
    totalDistance: number;
    availableFareInfo: AvailableFareInfo[];
    cabinClassAvailabilities: CabinClassAvailability[];
    trainDate: number;
    trainNumber: string;
    skipsDay: boolean;
}

export interface TrainAvailability{
    trains: Train[];
    totalTripTime: number;
    minPrice: number;
    dayChanged: boolean;
    connection: boolean;
}

export interface TrainLeg{
    trainAvailabilities: TrainAvailability[];
    resultCount: number;
}

export interface APIResponseData{
    trainLegs: TrainLeg[];
    legCount: number;
    roundTripDiscount: number;
    maxRegionalTrainsRoundTripDays: number;
}