-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: srv947.hstgr.io    Database: u779658787_ddc_nirmaan_db
-- ------------------------------------------------------
-- Server version	11.8.3-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `last_date` date DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `role` enum('Admin','Manager','Employee') DEFAULT 'Employee',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Rahul Sharma','rahul.sharma@ddc.com','9876543210',50000.00,'2024-01-15',NULL,'Active','Manager','2025-12-13 07:20:53','2025-12-13 07:20:53'),(2,'Priya Patel','priya.patel@ddc.com','9876543211',45000.00,'2024-02-01',NULL,'Active','Employee','2025-12-13 07:20:53','2025-12-13 07:20:53'),(3,'Amit Kumar','amit.kumar@ddc.com','9876543212',55000.00,'2023-06-10',NULL,'Active','Manager','2025-12-13 07:20:53','2025-12-13 07:20:53'),(4,'Sneha Singh','sneha.singh@ddc.com','9876543213',40000.00,'2024-03-20',NULL,'Active','Employee','2025-12-13 07:20:53','2025-12-13 07:20:53'),(5,'Vikram Gupta','vikram.gupta@ddc.com','9876543214',48000.00,'2023-11-05',NULL,'Inactive','Employee','2025-12-13 07:20:53','2025-12-13 07:20:53'),(6,'Anjali Verma','anjali.verma@ddc.com','9876543215',52000.00,'2024-01-01',NULL,'Active','Employee','2025-12-13 07:20:53','2025-12-13 07:20:53');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_name` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `lead_type` varchar(50) DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL,
  `lead_status` varchar(50) DEFAULT NULL,
  `last_contacted_date` varchar(20) DEFAULT NULL,
  `lead_assignee` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES (12,'Rahul Sharma','2024-12-01','+91-98765-43210','rahul.sharma@gmail.com','Tech Mahindra Ltd','123 MG Road, Bangalore, Karnataka','Hot Lead','Website','Open - Not Converted','2024-12-05','Sales Team A','Interested in enterprise solutions'),(13,'Priya Patel','2024-12-02','+91-98765-43211','priya.patel@gmail.com','Infosys Technologies','456 Brigade Road, Bangalore, Karnataka','Warm Lead','LinkedIn','Working - Completed','2024-12-06','Sales Team B','Follow-up meeting scheduled for next week'),(14,'Amit Kumar','2024-12-03','+91-98765-43212','amit.kumar@gmail.com','TCS Limited','789 Connaught Place, New Delhi','Cold Lead','Referral','Close - Convert','2024-12-07','Sales Team A','Successfully converted to premium customer'),(15,'Sneha Reddy','2024-12-04','+91-98765-43213','sneha.reddy@gmail.com','Wipro Technologies','321 Jubilee Hills, Hyderabad, Telangana','Hot Lead','Trade Show','Close - Lost','2024-12-08','Sales Team C','Lost to competitor pricing'),(16,'Vikram Singh','2024-12-05','+91-98765-43214','vikram.singh@gmail.com',NULL,'654 Park Street, Kolkata, West Bengal','Warm Lead','Cold Call','Open - Not Converted','2024-12-09','Sales Team B','Requires detailed product information'),(17,'Anjali Gupta','2024-12-06','+91-98765-43215','anjali.gupta@gmail.com','HCL Technologies','987 Sector 18, Noida, Uttar Pradesh','Hot Lead','Email Campaign','Working - Completed','2024-12-10','Sales Team A','Proposal submitted, awaiting approval'),(19,'Kavita Jain','2024-12-08','+91-98765-43217','kavita.jain@gmail.com','ICICI Bank Ltd','258 Bandra Kurla Complex, Mumbai, Maharashtra','Warm Lead','Social Media','Open - Not Converted','2024-12-12','Sales Team B','Initial contact established'),(21,'Meera Iyer','2024-12-10','+91-98765-43219','meera.iyer@gmail.com','ITC Limited','741 Virginia House, Chennai, Tamil Nadu','Cold Lead','Direct Mail','Close - Lost','2024-12-14','Sales Team C','No response after multiple follow-ups');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `related_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'New Task Assigned','You have been assigned a new task: \"Demo Task for today\"','task_assigned',71,1,'2025-12-14 18:03:40'),(6,16,'New Task Assigned','You have been assigned a new task: \"Test\"','task_assigned',77,0,'2025-12-16 11:10:01'),(7,20,'New Task Assigned','You have been assigned a new task: \"Client Visit to collect payment\"','task_assigned',78,0,'2025-12-16 11:40:13');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskcomments`
--

DROP TABLE IF EXISTS `taskcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taskcomments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `parent_comment_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `user_id` (`user_id`),
  KEY `parent_comment_id` (`parent_comment_id`),
  CONSTRAINT `taskcomments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `taskcomments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `taskcomments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `taskcomments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskcomments`
--

LOCK TABLES `taskcomments` WRITE;
/*!40000 ALTER TABLE `taskcomments` DISABLE KEYS */;
INSERT INTO `taskcomments` VALUES (23,63,1,'hello',NULL,'2025-12-14 09:57:58','2025-12-14 09:57:58'),(24,63,1,'Hello',NULL,'2025-12-14 11:52:02','2025-12-14 11:52:02'),(25,63,1,'Hello',NULL,'2025-12-14 11:52:05','2025-12-14 11:52:05'),(26,63,1,'Hello',NULL,'2025-12-14 11:52:08','2025-12-14 11:52:08'),(27,63,1,'Hello',NULL,'2025-12-14 12:41:42','2025-12-14 12:41:42'),(28,63,1,'hello',NULL,'2025-12-14 12:41:55','2025-12-14 12:41:55'),(29,63,1,'hello',NULL,'2025-12-14 12:42:26','2025-12-14 12:42:26'),(30,63,1,'hello',NULL,'2025-12-14 12:42:38','2025-12-14 12:42:38'),(31,63,1,'heelo',NULL,'2025-12-14 12:42:40','2025-12-14 12:42:40'),(32,63,1,'hi',NULL,'2025-12-14 12:45:03','2025-12-14 12:45:03'),(33,63,1,'hi',NULL,'2025-12-14 12:45:59','2025-12-14 12:45:59'),(34,63,1,'hello',NULL,'2025-12-14 12:52:25','2025-12-14 12:52:25'),(35,63,1,'Hello',NULL,'2025-12-14 12:52:45','2025-12-14 12:52:45'),(37,72,1,'Hello',NULL,'2025-12-15 05:17:36','2025-12-15 05:17:36'),(39,77,1,'Hello',NULL,'2025-12-16 11:12:03','2025-12-16 11:12:03');
/*!40000 ALTER TABLE `taskcomments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskNumber` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `projectName` varchar(255) DEFAULT NULL,
  `leadName` varchar(255) DEFAULT NULL,
  `assignTo` int(11) NOT NULL,
  `assignBy` int(11) NOT NULL,
  `priority` enum('High','Medium','Low') DEFAULT 'Medium',
  `status` enum('New','Working','Completed','On Hold','Cancelled') DEFAULT 'New',
  `dueDate` date NOT NULL,
  `description` text DEFAULT NULL,
  `createdDate` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_assignTo` (`assignTo`),
  KEY `idx_assignBy` (`assignBy`),
  KEY `idx_user_status` (`assignTo`,`status`),
  CONSTRAINT `fk_assignBy` FOREIGN KEY (`assignBy`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_assignTo` FOREIGN KEY (`assignTo`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`assignBy`) REFERENCES `users` (`id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assignBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (63,'TSK-10018','Equipment procurement - Dwarka','Marine Research Center',NULL,11,6,'Low','Completed','2025-12-18','Procure laboratory equipment for research center','2025-12-04','2025-12-11 07:16:05','2025-12-16 11:43:16'),(68,'TSK-10019','fgdgfdg','dgdd','dfgd',6,1,'High','New','2025-12-13','dfgdgd','2025-12-11','2025-12-11 15:28:55','2025-12-13 12:03:28'),(69,'TSK-10020','fdgfdgdf',NULL,NULL,6,1,'High','New','2025-12-27','5345fdfdgfgdg','2025-12-13','2025-12-13 12:25:05','2025-12-13 12:25:05'),(70,'TSK-10021','dsfsddfsd','sdfsdfsdf','fdsf',1,1,'Low','New','2025-12-20','fdsf','2025-12-13','2025-12-13 16:23:59','2025-12-13 16:23:59'),(72,'TSK-10023','Client visit',NULL,NULL,11,1,'High','Completed','2025-12-17',NULL,'2025-12-15','2025-12-15 05:14:58','2025-12-16 06:30:43'),(74,'TSK-10025','Jai Shree Ram',NULL,NULL,1,1,'High','New','2025-12-19','ffsds','2025-12-15','2025-12-15 11:22:17','2025-12-15 11:22:17'),(77,'TSK-10026','Test test hghghghghghghgh ghghhjhjhjhjhjhjh',NULL,NULL,16,1,'Medium','Working','2025-12-16','Test','2025-12-16','2025-12-16 11:10:01','2025-12-16 11:52:29'),(78,'TSK-10027','Client Visit to collect payment',NULL,NULL,20,1,'High','Working','2025-12-17','Visit Client to collect payment','2025-12-16','2025-12-16 11:40:13','2025-12-16 11:40:13');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` enum('Admin','HR','Site Manager','Office Staff') DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `is_temp_password` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Deepak','Vaishnav','deepak.divaishnav1996@gmail.com','+919876543210','deepak_admin','admin123','2025-12-10 06:51:28','2025-12-16 15:25:35','Admin','Active',0),(6,'Vikram','Gupta','vikram.gupta@example.com','+919876543214','vikram_worker','admin123','2025-12-10 07:15:42','2025-12-16 15:25:35','','Active',0),(9,'Admin','User','admin@example.com','','admin','admin123','2025-12-14 06:35:41','2025-12-16 15:25:35','Admin','Active',0),(11,'Test','User','test@example.com','1234567890','testuser','admin123','2025-12-15 10:52:32','2025-12-16 15:25:35','Admin','Active',0),(16,'Sangam','Sir','Sangam123@gmail.com','+91-5866306986','Sangam123@ddc','admin123','2025-12-16 06:25:07','2025-12-16 15:25:35','Office Staff','Active',0),(20,'Raghvendra','Rathore','raghvendra@eleva8cxm.com','+91-5884758479','raghvendra@eleva8cxm.com','admin123','2025-12-16 11:32:38','2025-12-16 15:25:35','Office Staff','Active',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-18 13:01:32
