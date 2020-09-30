create table if not exists "Vehicle_Type"
(
    id   serial      not null
        constraint vehicle_type_pk
            primary key,
    type varchar(80) not null
);
