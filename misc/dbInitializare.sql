use selfinn;

drop table if exists bookings cascade;

drop table if exists booking_state cascade;

drop table if exists card_account_association cascade;

drop table if exists cards cascade;

drop table if exists clients cascade;

drop table if exists company cascade;

drop table if exists accounts cascade;

drop table if exists hotel_facilities_association cascade;

drop table if exists facilities cascade;

drop table if exists hotels cascade;

create or replace table accounts
(
    ID     int auto_increment primary key,
    email  varchar(256) not null,
    parola varchar(256) not null,
    constraint UniqueEmail unique (email)
);
create or replace table company
(
    ID                    int auto_increment primary key,
    account_ID            int          not null,
    denumire              varchar(256) not null,
    cui                   varchar(16)  not null,
    numar_registru_comert varchar(32)  not null,
    sediu_social          varchar(256) not null,
    constraint UniqueCompany unique (cui, numar_registru_comert),
    constraint UniqueCui unique (cui),
    constraint UniqueNrRegCom unique (numar_registru_comert),
    constraint ValidCompanyAccount foreign key (account_ID) references accounts (ID) on delete cascade
);
create or replace table clients
(
    ID            int auto_increment primary key,
    account_ID    int          not null,
    prenume       varchar(256) not null,
    nume_familie  varchar(256) not null,
    CNP           varchar(16)  not null,
    serie_buletin varchar(16)  not null,
    constraint UniqueClient unique (cnp),
    constraint ValidClientAccount foreign key (account_ID) references accounts (ID) on delete cascade
);

create or replace table cards
(
    ID            int auto_increment primary key,
    numar_card    varchar(16) not null,
    data_expirare datetime    not null,
    cvv           int         not null,
    constraint UniqueCard unique (numar_card)
);
create or replace table card_account_association
(
    ID         int auto_increment primary key,
    account_ID int not null,
    card_ID    int not null,
    constraint UniqueCardForAccount unique (account_ID, card_ID),
    constraint ValidCardAccount foreign key (account_ID) references accounts (ID) on delete cascade,
    constraint ValidCard foreign key (card_ID) references cards (ID) on delete cascade
);

create or replace table hotels
(
    ID        int auto_increment primary key,
    denumire  varchar(128)  not null,
    descriere varchar(1024) not null
);
create or replace table facilities
(
    ID       int auto_increment primary key,
    denumire varchar(256) not null,
    constraint NumeUnicFacilitate unique (denumire)
);

create or replace table hotel_facilities_association
(
    ID            int auto_increment primary key,
    hotel_ID      int not null,
    facilitate_ID int not null,
    constraint FacilitateHotelUnic unique (hotel_ID, facilitate_ID),
    constraint ValidFacilityIDForHFAssoc foreign key (facilitate_ID) references facilities (ID) on delete cascade,
    constraint ValidHotelForHFAssoc foreign key (hotel_ID) references hotels (ID) on delete cascade
);
create or replace table booking_state
(
    ID              int auto_increment primary key,
    stare_rezervare varchar(256) not null,
    constraint StareUnica unique (stare_rezervare)
);
INSERT INTO booking_state (ID, stare_rezervare)
values (1, 'trimisa'),
    (2, 'acceptata'),
    (3, 'respinsa');

create or replace table bookings
(
    ID             int auto_increment primary key,
    hotel_ID       int      not null,
    data_check_in  datetime not null,
    data_check_out datetime not null,
    client_ID      int      not null,
    stare_ID       int      not null default 1,
    constraint ValidClientID foreign key (client_ID) references clients (ID) on delete cascade,
    constraint ValidHotelForBookings foreign key (hotel_ID) references hotels (ID) on delete cascade,
    constraint ValidBookingState foreign key (stare_ID) references booking_state (ID) on delete cascade
);

