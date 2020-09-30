create table if not exists "Vehicle"
(
    id              serial           not null
        constraint vehicle_pk
            primary key,
    make            varchar(40)      not null,
    model           varchar(80)      not null,
    capacity        integer          not null,
    mpg             double precision not null,
    "licensePlate"  varchar(10)      not null,
    "vehicleTypeId" integer
        constraint vehicle_vehicle_type_id_fk
            references "Vehicle_Type"
);
