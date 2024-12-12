# Create database script for London Events

# Create the database
CREATE DATABASE IF NOT EXISTS london_events;
USE london_events;

# Create the tables
CREATE TABLE IF NOT EXISTS events (id INT AUTO_INCREMENT,name VARCHAR(50),description TEXT, start_time DATETIME NOT NULL, end_time DATETIME, location VARCHAR(255), organiser VARCHAR(255),PRIMARY KEY(id));
CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT,firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(50), username VARCHAR(50), hashpassword CHAR(60), PRIMARY KEY(id));

# Create the app user
CREATE USER IF NOT EXISTS 'london_events_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON london_events.* TO ' london_events_app'@'localhost';
