-- Active: 1775030978688@@127.0.0.1@3306@eztrip_db
CREATE DATABASE IF NOT EXISTS EzTrip_Db;

USE EzTrip_Db;

CREATE TABLE Role (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Role (name) VALUES ('ADMIN'), ('CUSTOMER'), ('PROVIDER');

CREATE TABLE Gender (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO Gender (name) VALUES ('MALE'), ('FEMALE'), ('OTHER');

CREATE TABLE TypeOfProvider (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO TypeOfProvider (name) VALUES ('TRAVEL_AGENCY'), ('ACCOMMODATION'), ('BUS_OPERATOR'), ('AIRLINE');

CREATE TABLE TypeOfService (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO TypeOfService (name) VALUES ('TOURISM'), ('ACCOMMODATION'), ('TRANSPORTATION');

CREATE TABLE TypeOfTransportation (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO TypeOfTransportation (name) VALUES ('BUS'), ('AIRPLANE'), ('TRAIN'), ('CAR_RENTAL');

CREATE TABLE PaymentMethod (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO PaymentMethod (name) VALUES ('CASH'), ("MOMO"), ('BANK_TRANSFER');

CREATE TABLE BookingStatus (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO BookingStatus (name) VALUES ('PENDING'), ('CONFIRMED'), ('COMPLETED'), ('CANCELLED');

CREATE TABLE BaseUser (
    id int PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id int NOT NULL DEFAULT 2, -- Mặc định là CUSTOMER
    avatar VARCHAR(255) NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (role_id) REFERENCES Role(id)
);

CREATE TABLE CustomerProfile (
    id int PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL UNIQUE,
    dob DATE NULL,
    gender_id int NULL,

    FOREIGN KEY (gender_id) REFERENCES Gender(id),
    FOREIGN KEY (user_id) REFERENCES BaseUser(id) ON DELETE CASCADE
);

CREATE TABLE ProviderProfile (
    id int PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL UNIQUE,
    company_name VARCHAR(255) NULL,
    company_address VARCHAR(255) NULL,
    type_of_provider_id int NULL,

    FOREIGN KEY (type_of_provider_id) REFERENCES TypeOfProvider(id),
    FOREIGN KEY (user_id) REFERENCES BaseUser(id) ON DELETE CASCADE
);

CREATE TABLE Service (
    id int PRIMARY KEY AUTO_INCREMENT,
    provider_id int NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    type_of_service_id int NULL,

    FOREIGN KEY (provider_id) REFERENCES ProviderProfile(id) ON DELETE CASCADE,
    FOREIGN KEY (type_of_service_id) REFERENCES TypeOfService(id)
);

CREATE TABLE Image (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL,
    url VARCHAR(255) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES Service(id) ON DELETE CASCADE
);

CREATE TABLE ServiceTourism (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES Service(id) ON DELETE CASCADE
);

CREATE TABLE ServiceAccommodation (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    quantity_of_bed INT NOT NULL DEFAULT 1,
    area FLOAT NOT NULL,
    location VARCHAR(255) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES Service(id) ON DELETE CASCADE
);

CREATE TABLE ServiceTransportation (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL,
    type_of_transportation_id int NULL,
    departure_location VARCHAR(255) NOT NULL,
    arrival_location VARCHAR(255) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL, -- hay thêm này luôn ha

    FOREIGN KEY (service_id) REFERENCES Service(id) ON DELETE CASCADE,
    FOREIGN KEY (type_of_transportation_id) REFERENCES TypeOfTransportation(id)
);

CREATE TABLE Booking (
    id int PRIMARY KEY AUTO_INCREMENT,
    customer_id int NOT NULL,
    service_id int NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method_id int NULL,
    status_id int NOT NULL DEFAULT 1, -- Mặc định là PENDING, ê nhớ đổ dữ liệu ở trên trước á

    FOREIGN KEY (customer_id) REFERENCES CustomerProfile(id) ON DELETE RESTRICT,
    FOREIGN KEY (service_id) REFERENCES Service(id) ON DELETE RESTRICT,
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethod(id),
    FOREIGN KEY (status_id) REFERENCES BookingStatus(id)
);

CREATE TABLE Review (
    id int PRIMARY KEY AUTO_INCREMENT,
    booking_id int NOT NULL UNIQUE,
    rating INT NOT NULL,
    comment TEXT NULL,
    review_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES Booking(id) ON DELETE RESTRICT
);

