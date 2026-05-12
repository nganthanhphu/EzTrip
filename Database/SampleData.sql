-- Sample data for EzTrip. Password is phone number
USE EzTrip_Db;

INSERT INTO base_user (id, fullname, email, password, role_id, avatar, phone_number, is_active) VALUES
  (1, 'Admin', 'admin@eztrip.local', '$2b$10$BgLWWjShhNc3VoBipgbneeiI7ifGGYSK6dG0veYeSsgkOs/o1id3a', 1, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '001', TRUE),
  (100, 'Customer 100', 'customer100@eztrip.local', '$2b$10$1yKWO8gp3D59KKIV9PeWOeZEz07I5Cz6Z9rIBAaaQNOD3XInA3wIS', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '100', TRUE),
  (101, 'Customer 101', 'customer101@eztrip.local', '$2b$10$anD5fWvp4TyE3ZUrsc/qC.nbpSUgxz0jMPHN6xBhqLKmLADundUP.', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '101', TRUE),
  (102, 'Customer 102', 'customer102@eztrip.local', '$2b$10$iX0x2Je7h68KsS9GrBJ6mOQ1umCUUq.2QMDi2ZHC52wV5td3XDdoa', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '102', TRUE),
  (103, 'Customer 103', 'customer103@eztrip.local', '$2b$10$WgvwUE90HEVgi/QnLg4nXuRDM6EN/WSZC8kf.7lt/7BTa2ZMZW5Ve', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '103', TRUE),
  (104, 'Customer 104', 'customer104@eztrip.local', '$2b$10$01t0T1/CVtpq2OzK1pwIYuxAWtkvjgaswl.3e9INw/4JqOozQlc1m', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '104', TRUE),
  (105, 'Customer 105', 'customer105@eztrip.local', '$2b$10$/eGNK6Y6ZgzPqb3kzYImR.6lHfEoa2Wm9DlkFzjBGUnUkHcWSrpMS', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '105', TRUE),
  (106, 'Customer 106', 'customer106@eztrip.local', '$2b$10$/VlbJS46H3TEGDOUWycmJO.m/EnfrflN3PaPVIC4mXg85pQOWsUiu', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '106', TRUE),
  (107, 'Customer 107', 'customer107@eztrip.local', '$2b$10$45onwG5/Skc2x8o5gZGZdO3amaTsM5KnGgF.llcMunbC8dFoJMtVC', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '107', TRUE),
  (108, 'Customer 108', 'customer108@eztrip.local', '$2b$10$T0hF4jEKRL.duwhzH27FgeAIPn1dPJb99V07BU04Z95nBScghc45e', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '108', TRUE),
  (109, 'Customer 109', 'customer109@eztrip.local', '$2b$10$iKYpFmamgWbkhfQ8wTrUGeS0/Rp7/OVIxx4YcBVsFoZ5zcsfDpntu', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '109', TRUE),
  (110, 'Customer 110', 'customer110@eztrip.local', '$2b$10$z1dUU.KhMk.6q.N1RSOGFOLa5E7Ncvf4Y1HjK80r5DCCpR5u8a6IG', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '110', TRUE),
  (111, 'Customer 111', 'customer111@eztrip.local', '$2b$10$/J9GTS/2ziNLBh9wKm66BuP1rMTQ/iPZ.Fkfquvmokftqm0p8o8AO', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '111', TRUE),
  (112, 'Customer 112', 'customer112@eztrip.local', '$2b$10$A.pXpxWAggcYHqkQRjqNmOkV/ypP0CFcAnzkMaBM9IsWubS81/t1K', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '112', TRUE),
  (113, 'Customer 113', 'customer113@eztrip.local', '$2b$10$AFBzKBejNFnli59.tMgSKOtjP5msONKqXVD/86aZDwLT0BbgYgldO', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '113', TRUE),
  (114, 'Customer 114', 'customer114@eztrip.local', '$2b$10$YdvAs4nNhetzHnCu2EYD2.pmoPCIkv0XWCtZ29iqI.0maiksVU1ya', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '114', TRUE),
  (115, 'Customer 115', 'customer115@eztrip.local', '$2b$10$OBD43sCVxXrmrV7yFecRy.G1JWC.Xta7pWJZp2UVuRLK/0Z0wTTSa', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '115', TRUE),
  (116, 'Customer 116', 'customer116@eztrip.local', '$2b$10$fB4s0HoSJxd1T4eDMDW9Bu2uXjDrjqrI15HfsXOkmv9ubRAd7EI3a', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '116', TRUE),
  (117, 'Customer 117', 'customer117@eztrip.local', '$2b$10$n6GNGeRPHDs3anAFAui3Je47T.S93Z2XJI8ZJ4F.sQ7kdOvlg4i3.', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '117', TRUE),
  (118, 'Customer 118', 'customer118@eztrip.local', '$2b$10$bM0HYY/d82HQGJ8AIGPo.eIRF2IgQf2YBHrSunqsGbOQkgWFQRQ6.', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '118', TRUE),
  (119, 'Customer 119', 'customer119@eztrip.local', '$2b$10$urKZSJjWO.ofg0lMb95E4efL/jqvuOw3e94q4qEXbQOMgEMMDmvRO', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '119', TRUE),
  (120, 'Customer 120', 'customer120@eztrip.local', '$2b$10$sOB2vYtJz8ElTDfq/ch.AO6EmPGW2XdHvWk4x50OvNAGO7YUD6n0W', 2, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '120', TRUE),
  (201, 'Provider 201', 'provider201@eztrip.local', '$2b$10$6wjnNXycCsQu7Y6Calmr8uo.7iIPomlhyJj3iqQFzTgNFuyc6X1t.', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '201', TRUE),
  (202, 'Provider 202', 'provider202@eztrip.local', '$2b$10$X9yez3XWbrYnBgycwVHDVe0f.XVwT./XPAQRaOKT35rFi4L/jzJ/G', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '202', TRUE),
  (203, 'Provider 203', 'provider203@eztrip.local', '$2b$10$jmKc51ho6NcwMSpwQuZ31ehkbt0zOysCjA424x0JeWYsXrQ1VE.ba', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '203', TRUE),
  (204, 'Provider 204', 'provider204@eztrip.local', '$2b$10$0x/dz6r9LB7NyeNe1AIeAO8BLlpJOhB558IX7KYDxPLGNFI4NO4qi', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '204', TRUE),
  (205, 'Provider 205', 'provider205@eztrip.local', '$2b$10$6YxSYAg3C0rziIeZI/ysY.UrSEFUiKpp80Iw2G7T1PR49cjbegRm.', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '205', TRUE),
  (206, 'Provider 206', 'provider206@eztrip.local', '$2b$10$.YGrAFXAFoI2ToA78SgPEOTMMd9Tzya.gZt9zH/TnMgGa3xOCTFDy', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '206', TRUE),
  (207, 'Provider 207', 'provider207@eztrip.local', '$2b$10$cb0FDsQzWuBUTWxRiB/2ke41TSgq3lm99OcuLI0f.x4T9CdMRJvLy', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '207', TRUE),
  (208, 'Provider 208', 'provider208@eztrip.local', '$2b$10$T37FhOC8/gIj0RRzNLcJOOPWYqO1H6hwAecAIPj4JSeNresfEHGQq', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '208', TRUE),
  (209, 'Provider 209', 'provider209@eztrip.local', '$2b$10$9NWPkrqXIiuFq/e/qYjF5.pps92fm/192AgQvO488TbFtkdSxlDSu', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '209', TRUE),
  (210, 'Provider 210', 'provider210@eztrip.local', '$2b$10$NpNaT7nBQ5kgIa3HwuRenu0h.OY/FKftjx5vJZwD6DuzYP.Cf5e5K', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '210', TRUE),
  (211, 'Provider 211', 'provider211@eztrip.local', '$2b$10$2CaqFpoNafzYKI5XlFoA4OKzGq5eGTA24rs2i7.qq2Q1ETeevEV4y', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '211', TRUE),
  (212, 'Provider 212', 'provider212@eztrip.local', '$2b$10$W1sooY1zGg0jAK3ndaytCOR85M.oUesbkenlTNBMow6YhBWbeN116', 3, 'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/avatar_ipfsn6.jpg', '212', TRUE);

DROP TEMPORARY TABLE IF EXISTS tmp_numbers;
CREATE TEMPORARY TABLE tmp_numbers (n INT PRIMARY KEY);
INSERT INTO tmp_numbers (n)
SELECT ones.n + tens.n * 10 + 1
FROM (
  SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
  UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
) AS ones
CROSS JOIN (
  SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2
) AS tens
WHERE ones.n + tens.n * 10 + 1 <= 30;

INSERT INTO customer_profile (id, user_id, dob, gender_id)
SELECT
  99 + n,
  99 + n,
  DATE_ADD('1990-01-01', INTERVAL (n - 1) DAY),
  1 + ((99 + n) % 3)
FROM tmp_numbers
WHERE n <= 21;

INSERT INTO provider_profile (id, user_id, company_name, company_address, type_of_provider_id)
SELECT
  200 + n,
  200 + n,
  CONCAT('Provider ', 200 + n, ' Co'),
  CONCAT('Address ', 200 + n),
  CASE
    WHEN n <= 3 THEN 1
    WHEN n <= 6 THEN 2
    WHEN n <= 9 THEN 3
    ELSE 4
  END
FROM tmp_numbers
WHERE n <= 12;

INSERT INTO service (id, provider_id, name, description, price, quantity, type_of_service_id, is_active)
SELECT
  1000 + n,
  201 + ((n - 1) % 3),
  CONCAT('Tourism Package ', LPAD(n, 2, '0')),
  CONCAT('Tourism service sample ', n),
  500 + (n * 10),
  10 + (n % 5),
  1,
  CASE WHEN n <= 15 THEN TRUE ELSE FALSE END
FROM tmp_numbers
WHERE n <= 20;

INSERT INTO service_tourism (service_id, start_date, end_date, location)
SELECT
  1000 + n,
  DATE_ADD('2026-06-01', INTERVAL n DAY),
  DATE_ADD('2026-06-03', INTERVAL n DAY),
  CONCAT('City ', n)
FROM tmp_numbers
WHERE n <= 20;

INSERT INTO service (id, provider_id, name, description, price, quantity, type_of_service_id, is_active)
SELECT
  2000 + n,
  204 + ((n - 1) % 3),
  CONCAT('Accommodation ', LPAD(n, 2, '0')),
  CONCAT('Accommodation service sample ', n),
  300 + (n * 8),
  1 + (n % 4),
  2,
  CASE WHEN n <= 15 THEN TRUE ELSE FALSE END
FROM tmp_numbers
WHERE n <= 20;

INSERT INTO service_accommodation (service_id, check_in_date, check_out_date, quantity_of_bed, area, location)
SELECT
  2000 + n,
  DATE_ADD('2026-07-01', INTERVAL n DAY),
  DATE_ADD('2026-07-02', INTERVAL n DAY),
  1 + (n % 3),
  20 + (n % 5) * 5,
  CONCAT('District ', n)
FROM tmp_numbers
WHERE n <= 20;

INSERT INTO service (id, provider_id, name, description, price, quantity, type_of_service_id, is_active)
SELECT
  3000 + n,
  207 + ((n - 1) % 6),
  CONCAT('Transportation ', LPAD(n, 2, '0')),
  CONCAT('Transportation service sample ', n),
  100 + (n * 3),
  20 + (n % 10),
  3,
  CASE WHEN n <= 15 THEN TRUE ELSE FALSE END
FROM tmp_numbers
WHERE n <= 20;

INSERT INTO service_transportation (service_id, type_of_transportation_id, departure_location, arrival_location, departure_time, arrival_time)
SELECT
  3000 + n,
  CASE
    WHEN (207 + ((n - 1) % 6)) >= 210 THEN 2
    ELSE CASE ((n - 1) % 3) WHEN 0 THEN 1 WHEN 1 THEN 3 ELSE 4 END
  END,
  CONCAT('City ', (n % 10) + 1),
  CONCAT('City ', (n % 10) + 2),
  DATE_ADD('2026-08-01 08:00:00', INTERVAL n DAY),
  DATE_ADD('2026-08-01 12:00:00', INTERVAL n DAY)
FROM tmp_numbers
WHERE n <= 20;

INSERT INTO image (service_id, url)
SELECT
  s.id,
  'https://res.cloudinary.com/dkzzyue98/image/upload/v1767704642/g6o8vehguon2x7vgxnej.png'
FROM service s
JOIN tmp_numbers i ON i.n <= (1 + (s.id % 5))
WHERE s.id BETWEEN 1000 AND 3019;

INSERT INTO booking (id, customer_id, service_id, booking_date, payment_method_id, status_id)
SELECT
  (s.id * 10 + b.n),
  101 + ((s.id + b.n) % 20),
  s.id,
  DATE_ADD('2026-05-01 09:00:00', INTERVAL ((s.id % 20) + b.n) DAY),
  1 + (b.n % 3),
  1 + ((s.id + b.n) % 4)
FROM service s
JOIN tmp_numbers b ON b.n <= 10
WHERE s.id BETWEEN 1000 AND 3019;

INSERT INTO review (booking_id, rating, comment, review_date)
SELECT
  b.id,
  3 + (b.id % 3),
  CONCAT('Review for booking ', b.id),
  DATE_ADD(b.booking_date, INTERVAL 1 DAY)
FROM booking b
WHERE b.status_id = 3 AND (b.id % 3) = 0;
