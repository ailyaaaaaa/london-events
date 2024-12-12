# Insert data into the tables

USE london_events;

INSERT INTO events (name, description, start_time, end_time, location, organiser) VALUES (
    'Tech Conference 2025',
    'A technology conference showcasing the latest innovations in AI and Machine Learning.',
    '2025-05-15 09:00:00',
    '2025-05-15 17:00:00',
    'Excel Center, Custom House',
    'Tech Events Co.'
), (
    'Winter Wonderland',
    'Annual Christmas winter wonderland fair held in Hyde Park, London.',
    '2024-11-18 09:00:00',
    '2025-01-07 17:00:00',
    'Hyde Park',
    'Royal Parks of London'
), (
    'Engelbert Humperdinck Concert',
    'A performance of classics such as "A Man Without Love", "Love Me With All Your Heart", and "The Last Waltz".',
    '2025-08-22 18:00:00',
    '2025-08-22 20:30:00',
    'Troxy, Limehouse',
    'AEG Live'
);