use selfinn;

drop table if exists bookings;

drop table if exists booking_state;

drop table if exists card_account_association;

drop table if exists cards;

drop table if exists clients;

drop table if exists hotel_facilities_association;

drop table if exists facilities;

drop table if exists hotels;

drop table if exists company;

drop table if exists accounts;


delete
from mysql.proc
WHERE db LIKE 'selfinn';

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
    ID         int auto_increment primary key,
    company_ID int           not null,
    denumire   varchar(128)  not null,
    descriere  varchar(1024) not null,
    constraint ValidOwnerForHotel foreign key (company_ID) references company (ID) on delete cascade
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

create
    definer = root@localhost procedure Accounts_Login(IN in_email varchar(256), IN in_password varchar(256))
begin
    declare v_valid_credentials int default 0;
    declare v_acc_ID int default 0;
    declare v_is_client_account int default 0;
    declare v_acc_type varchar(256);
    declare v_name_in_app varchar(256);

    select count(*) into v_valid_credentials from accounts where email = in_email and parola = in_password;

    if v_valid_credentials = 0 then
        signal sqlstate '45000' set message_text = '$Invalid credentials$';
    end if;

    select ID into v_acc_ID from accounts where email = in_email and parola = in_password;

    select COUNT(*) into v_is_client_account from clients where account_ID = v_acc_ID;

    if v_is_client_account != 0 then
        set v_acc_type = 'client';
        select CONCAT(c.prenume, ' ', c.nume_familie)
        into v_name_in_app
        from clients c
        where c.account_ID = v_acc_ID
        limit 1;
        select v_acc_ID      as ID,
               in_email      as email,
               v_acc_type    as account_type,
               v_name_in_app as in_app_name;
    else
        set v_acc_type = 'company';
        select denumire into v_name_in_app from company where account_ID = v_acc_ID;
        select v_acc_ID      as ID,
               in_email      as email,
               v_acc_type    as account_type,
               v_name_in_app as in_app_name;
    end if;
end;


create
    definer = root@localhost procedure Company_Register(IN in_email varchar(256), IN in_password varchar(256)
, IN in_denumire varchar(256), IN in_cui varchar(16), IN in_nr_reg_com varchar(32), IN in_sediu_social varchar(256))
begin
    declare v_acc_already_exists int default 0;
    declare v_acc_ID int default 0;
    select count(*)
    into v_acc_already_exists
    from accounts
    where email = in_email;

    if v_acc_already_exists != 0 then
        signal sqlstate '45000' set message_text = '$Email already in use$';
    end if;

    insert into accounts (email, parola) VALUES (in_email, in_password);
    select last_insert_id() into v_acc_ID;

    insert into company (account_ID, denumire, cui, numar_registru_comert, sediu_social)
    VALUES (v_acc_ID, in_denumire, in_cui, in_nr_reg_com, in_sediu_social);

    select v_acc_ID    as ID,
           in_email    as email,
           'company'   as account_type,
           in_denumire as in_app_name;
end;

create
    definer = root@localhost procedure Client_Register(IN in_email varchar(256), IN in_password varchar(256)
, IN in_prenume varchar(256), IN in_nume_familie varchar(16), IN in_cnp varchar(16), IN in_serie_buletin varchar(16))
begin
    declare v_acc_already_exists int default 0;
    declare v_acc_ID int default 0;
    select count(*)
    into v_acc_already_exists
    from accounts
    where email = in_email;

    if v_acc_already_exists != 0 then
        signal sqlstate '45000' set message_text = '$Email already in use$';
    end if;

    insert into accounts (email, parola) VALUES (in_email, in_password);
    select last_insert_id() into v_acc_ID;

    insert into clients (account_ID, prenume, nume_familie, CNP, serie_buletin)
    values (v_acc_ID, in_prenume, in_nume_familie, in_cnp, in_serie_buletin);

    select v_acc_ID                                 as ID,
           in_email                                 as email,
           'client'                                 as account_type,
           concat(in_prenume, ' ', in_nume_familie) as in_app_name;
end;

create or replace
    definer = root@localhost procedure Hotel_Add(IN in_acc_ID int, IN in_denumire varchar(256),
                                                 IN in_descriere varchar(256))
begin
    declare v_company_ID int default -1;

    declare v_acc_exists int default 0;
    select count(*) into v_acc_exists from accounts where ID = in_acc_ID;

    if v_acc_exists = -1 then
        signal sqlstate '45000' set message_text = '$Invalid account id$';
    end if;

    select account_ID into v_company_ID from company where ID = in_acc_ID;

    if v_company_ID = -1 then
        signal sqlstate '45000' set message_text = '$Invalid account id$';
    end if;

    insert into hotels (company_ID, denumire, descriere)
    VALUES (v_company_ID, in_denumire, in_descriere);

    select last_insert_id() as ID;

end;
