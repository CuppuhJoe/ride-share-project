create table if not exists "User" (
    id serial not null constraint user_pk primary key,
    "firstName" varchar(40) not null,
    "lastName" varchar(40) not null,
    email varchar(120) not null,
    password varchar(100) not null,
    phone integer,
    "isAdmin" boolean not null
);
create unique index if not exists user_email_uindex on "User" (email);
create table if not exists "State" (
    abbreviation varchar(2) not null constraint state_pk primary key,
    name varchar(20) not null
);
create unique index if not exists state_abbreviation_uindex on "State" (abbreviation);
create unique index if not exists state_name_uindex on "State" (name);
create table if not exists "Driver" (
    id serial not null constraint driver_pk primary key,
    "userId" integer not null constraint "userId" references "User",
    "licenseNumber" varchar(20) not null,
    "licenseState" varchar(2) constraint "licenseState" references "State"
);
create table if not exists "Location" (
    id serial not null constraint location_pk primary key,
    name varchar(40) not null,
    address varchar(40) not null,
    city varchar(40) not null,
    state varchar(2) not null constraint state references "State",
    "zipCode" varchar(15) not null,
    "fuelPrice" double precision not null
);
create table if not exists "Vehicle_Type" (
    id serial not null constraint vehicle_type_pk primary key,
    type varchar(80) not null
);
create table if not exists "Vehicle" (
    id serial not null constraint vehicle_pk primary key,
    make varchar(40),
    model varchar(80) not null,
    color varchar(20) not null,
    "vehicleTypeId" integer not null constraint vehicletypeid references "Vehicle_Type",
    capacity integer not null,
    "licenseState" varchar(2) not null constraint "licenseState" references "State",
    "licensePlate" varchar(10) not null
);
create table if not exists "Ride" (
    id serial not null constraint ride_pk primary key,
    date date not null,
    time time not null,
    distance double precision not null,
    fee double precision not null,
    "vehicleId" integer not null constraint "vehicleId" references "Vehicle",
    "fromLocationId" integer not null constraint "fromLocationId" references "Location",
    "toLocationId" integer not null constraint "toLocationId" references "Location"
);
create table if not exists "Passenger" (
    "passengerId" integer not null constraint "passengerId" references "User",
    "rideId" integer not null constraint "rideId" references "Ride",
    constraint passenger_pk primary key ("passengerId", "rideId")
);
create table if not exists "Drivers" (
    "driverId" integer not null constraint "driverId" references "Driver",
    "rideId" integer not null constraint "rideId" references "Ride",
    constraint drivers_pk primary key ("driverId", "rideId")
);
create table if not exists "Authorization" (
    "driverId" integer not null constraint "driverId" references "Driver",
    "vehicleId" integer not null constraint "vehicleId" references "Vehicle",
    constraint authorization_pk primary key ("driverId", "vehicleId")
);