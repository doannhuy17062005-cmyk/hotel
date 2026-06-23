-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_booking
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `num_guests` int NOT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrgoycol97o21kpjodw1qox4nc` (`room_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrgoycol97o21kpjodw1qox4nc` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'2025-12-21','2025-12-31','2025-12-15 13:23:05.634168',1,'CONFIRMED',5000000.00,1,2),(2,'2025-12-17','2025-12-18','2025-12-16 05:31:49.599705',1,'CONFIRMED',500000.00,1,2),(3,'2025-12-17','2025-12-19','2025-12-16 05:40:53.222412',2,'CONFIRMED',1040000.00,2,2),(4,'2025-12-19','2025-12-25','2025-12-16 14:22:18.729137',4,'CONFIRMED',15000000.00,14,2);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_method` enum('CASH','CREDIT_CARD','BANK_TRANSFER','ONLINE') NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_nuscjm6x127hkb15kcb8n56wo` (`booking_id`),
  CONSTRAINT `FKc52o2b1jkxttngufqp3t7jr3h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,5000000.00,NULL,'CASH','PENDING',1),(2,500000.00,NULL,'ONLINE','PENDING',2),(3,1040000.00,'2025-12-16 05:41:46.820448','ONLINE','COMPLETED',3),(4,15000000.00,'2025-12-16 14:23:07.306216','ONLINE','COMPLETED',4);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_price` decimal(10,2) NOT NULL,
  `description` text,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_b70k1tp1aa52elkkxht660u36` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES (1,550000.00,'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản','Standard'),(2,1000000.00,'Phòng cao cấp với view đẹp và tiện nghi hiện đại','Deluxe'),(3,2000000.00,'Phòng Suite sang trọng với phòng khách riêng biệt','Suite'),(4,5000000.00,'Phòng VIP đẳng cấp nhất với dịch vụ butler 24/7','VIP'),(5,800000.00,'Phòng Superior rộng rãi hơn với ban công riêng. Bao gồm: giường King, TV 43 inch, minibar, két sắt.','Superior'),(6,3500000.00,'Phòng Executive Suite dành cho doanh nhân. Bao gồm: phòng họp nhỏ, dịch vụ ủi đồ miễn phí, bữa sáng VIP.','Executive Suite'),(7,8000000.00,'Phòng tổng thống - đẳng cấp nhất khách sạn. Bao gồm: 2 phòng ngủ, phòng khách lớn, butler 24/7, transfer sân bay.','Presidential Suite');
/*!40000 ALTER TABLE `room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `capacity` int NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `status` enum('AVAILABLE','OCCUPIED','MAINTENANCE') NOT NULL,
  `room_type_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_7ljglxlj90ln3lbas4kl983m2` (`room_number`),
  KEY `FKh9m2n1paq5hmd3u0klfl7wsfv` (`room_type_id`),
  CONSTRAINT `FKh9m2n1paq5hmd3u0klfl7wsfv` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,2,'Phòng Standard hướng sân','/uploads/90c9d933-999c-4c83-b563-e0999405db8a.jpg',500000.00,'101','AVAILABLE',1),(2,2,'Phòng Standard hướng phố','/uploads/33f63c63-6c58-466c-83b4-b7e3794f21ec.jpg',520000.00,'102','AVAILABLE',1),(3,2,'Phòng Standard có cửa sổ lớn','https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',550000.00,'103','AVAILABLE',1),(4,2,'Phòng Standard yên tĩnh','https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',500000.00,'201','AVAILABLE',1),(5,3,'Phòng Standard cho gia đình nhỏ','https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',580000.00,'202','AVAILABLE',1),(6,2,'Phòng Superior view hồ bơi','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',800000.00,'301','AVAILABLE',5),(7,2,'Phòng Superior với ban công rộng','https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',850000.00,'302','AVAILABLE',5),(8,3,'Phòng Superior góc','https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800',880000.00,'401','AVAILABLE',5),(9,2,'Phòng Superior hiện đại','https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',850000.00,'402','AVAILABLE',5),(10,2,'Phòng Deluxe view thành phố','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',1200000.00,'501','AVAILABLE',2),(11,2,'Phòng Deluxe với bồn tắm đẹp','https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800',1300000.00,'502','AVAILABLE',2),(12,3,'Phòng Deluxe Premium','https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',1400000.00,'601','AVAILABLE',2),(13,2,'Phòng Deluxe Corner','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',1350000.00,'602','AVAILABLE',2),(14,4,'Suite Ocean View','https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800',2500000.00,'701','AVAILABLE',3),(15,4,'Suite Garden View','https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',2400000.00,'702','AVAILABLE',3),(16,4,'Suite với jacuzzi','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',2800000.00,'801','AVAILABLE',3),(17,3,'Executive Suite Business','https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800',3500000.00,'901','AVAILABLE',6),(18,4,'Executive Suite Premium','https://images.unsplash.com/photo-1594560913095-8cf34bab82ad?w=800',3800000.00,'902','AVAILABLE',6),(19,6,'Presidential Suite - Penthouse','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',8000000.00,'1001','AVAILABLE',7);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'2025-12-15 03:03:18.906013','admin@hotel.com','Administrator','$2a$10$3BR25.5ivG/JU51WNwm9jOOXeqTCWtWkPcjp8uOKF9vLECtwFXhVW',NULL,'ADMIN'),(2,'Cư Chánh 1, Phường Thủy Bằng','2025-12-15 11:26:53.358743','duong120503mk@gmail.com','Nguyễn Duy Dương','$2a$10$unn1KLeWU0Vpu811hfHuKeTrwF2EvWKvdLviOhEa9ADFTBtsMtYUG','0123456789','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hotel_booking'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-16 21:34:28
