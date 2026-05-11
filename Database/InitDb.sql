-- Active: 1775030978688@@127.0.0.1@3306@eztrip_db
CREATE DATABASE IF NOT EXISTS EzTrip_Db;

USE EzTrip_Db;

CREATE TABLE role (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO role (name) VALUES ('ADMIN'), ('CUSTOMER'), ('PROVIDER');

CREATE TABLE gender (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO gender (name) VALUES ('MALE'), ('FEMALE'), ('OTHER');

CREATE TABLE type_of_provider (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO type_of_provider (name) VALUES ('TRAVEL_AGENCY'), ('ACCOMMODATION'), ('BUS_OPERATOR'), ('AIRLINE');

CREATE TABLE type_of_service (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO type_of_service (name) VALUES ('TOURISM'), ('ACCOMMODATION'), ('TRANSPORTATION');

CREATE TABLE type_of_transportation (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO type_of_transportation (name) VALUES ('BUS'), ('AIRPLANE'), ('TRAIN'), ('CAR_RENTAL');

CREATE TABLE payment_method (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO payment_method (name) VALUES ('CASH'), ("MOMO"), ('BANK_TRANSFER');

CREATE TABLE booking_status (
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO booking_status (name) VALUES ('PENDING'), ('CONFIRMED'), ('COMPLETED'), ('CANCELLED');

CREATE TABLE base_user (
    id int PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id int NOT NULL DEFAULT 2, -- Mặc định là CUSTOMER
    avatar VARCHAR(255) NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE customer_profile (
    id int PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL UNIQUE,
    dob DATE NULL,
    gender_id int NULL,

    FOREIGN KEY (gender_id) REFERENCES gender(id),
    FOREIGN KEY (user_id) REFERENCES base_user(id) ON DELETE CASCADE
);

CREATE TABLE provider_profile (
    id int PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NULL,
    type_of_provider_id int NOT NULL,

    FOREIGN KEY (type_of_provider_id) REFERENCES type_of_provider(id),
    FOREIGN KEY (user_id) REFERENCES base_user(id) ON DELETE CASCADE
);

CREATE TABLE service (
    id int PRIMARY KEY AUTO_INCREMENT,
    provider_id int NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    type_of_service_id int NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (provider_id) REFERENCES provider_profile(id) ON DELETE CASCADE,
    FOREIGN KEY (type_of_service_id) REFERENCES type_of_service(id)
);

CREATE TABLE image (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL,
    url VARCHAR(255) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE
);

CREATE TABLE service_tourism (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE
);

CREATE TABLE service_accommodation (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL UNIQUE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    quantity_of_bed INT NOT NULL DEFAULT 1,
    area FLOAT NOT NULL,
    location VARCHAR(255) NOT NULL,

    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE
);

CREATE TABLE service_transportation (
    id int PRIMARY KEY AUTO_INCREMENT,
    service_id int NOT NULL UNIQUE,
    type_of_transportation_id int NULL,
    departure_location VARCHAR(255) NOT NULL,
    arrival_location VARCHAR(255) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL, -- hay thêm này luôn ha

    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE,
    FOREIGN KEY (type_of_transportation_id) REFERENCES type_of_transportation(id)
);

CREATE TABLE booking (
    id int PRIMARY KEY AUTO_INCREMENT,
    customer_id int NOT NULL,
    service_id int NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method_id int NULL,
    status_id int NOT NULL DEFAULT 1, -- Mặc định là PENDING, ê nhớ đổ dữ liệu ở trên trước á

    FOREIGN KEY (customer_id) REFERENCES customer_profile(id) ON DELETE RESTRICT,
    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE RESTRICT,
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(id),
    FOREIGN KEY (status_id) REFERENCES booking_status(id)
);

CREATE TABLE review (
    id int PRIMARY KEY AUTO_INCREMENT,
    booking_id int NOT NULL UNIQUE,
    rating INT NOT NULL,
    comment TEXT NULL,
    review_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE RESTRICT
);

