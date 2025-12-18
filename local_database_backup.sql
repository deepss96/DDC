-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ddc_developer
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'New Task Assigned','You have been assigned a new task: \"Demo Task for today\"','task_assigned',71,1,'2025-12-14 18:03:40'),(2,3,'New Task Assigned','You have been assigned a new task: \"Client visit\"','task_assigned',72,1,'2025-12-15 05:14:58');
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskcomments`
--

LOCK TABLES `taskcomments` WRITE;
/*!40000 ALTER TABLE `taskcomments` DISABLE KEYS */;
INSERT INTO `taskcomments` VALUES (23,63,1,'hello',NULL,'2025-12-14 09:57:58','2025-12-14 09:57:58'),(24,63,1,'Hello',NULL,'2025-12-14 11:52:02','2025-12-14 11:52:02'),(25,63,1,'Hello',NULL,'2025-12-14 11:52:05','2025-12-14 11:52:05'),(26,63,1,'Hello',NULL,'2025-12-14 11:52:08','2025-12-14 11:52:08'),(27,63,1,'Hello',NULL,'2025-12-14 12:41:42','2025-12-14 12:41:42'),(28,63,1,'hello',NULL,'2025-12-14 12:41:55','2025-12-14 12:41:55'),(29,63,1,'hello',NULL,'2025-12-14 12:42:26','2025-12-14 12:42:26'),(30,63,1,'hello',NULL,'2025-12-14 12:42:38','2025-12-14 12:42:38'),(31,63,1,'heelo',NULL,'2025-12-14 12:42:40','2025-12-14 12:42:40'),(32,63,1,'hi',NULL,'2025-12-14 12:45:03','2025-12-14 12:45:03'),(33,63,1,'hi',NULL,'2025-12-14 12:45:59','2025-12-14 12:45:59'),(34,63,1,'hello',NULL,'2025-12-14 12:52:25','2025-12-14 12:52:25'),(35,63,1,'Hello',NULL,'2025-12-14 12:52:45','2025-12-14 12:52:45'),(36,72,3,'hello',NULL,'2025-12-15 05:17:21','2025-12-15 05:17:21'),(37,72,1,'Hello',NULL,'2025-12-15 05:17:36','2025-12-15 05:17:36');
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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (63,'TSK-10018','Equipment procurement - Dwarka','Marine Research Center',NULL,3,1,'Low','Completed','2025-12-18','Procure laboratory equipment for research center','2025-12-04','2025-12-11 07:16:05','2025-12-17 07:17:08'),(68,'TSK-10019','fgdgfdg','dgdd','dfgd',6,1,'High','New','2025-12-13','dfgdgd','2025-12-11','2025-12-11 15:28:55','2025-12-13 12:03:28'),(69,'TSK-10020','fdgfdgdf',NULL,NULL,6,1,'High','New','2025-12-27','5345fdfdgfgdg','2025-12-13','2025-12-13 12:25:05','2025-12-13 12:25:05'),(70,'TSK-10021','dsfsddfsd','sdfsdfsdf','fdsf',1,1,'Low','New','2025-12-20','fdsf','2025-12-13','2025-12-13 16:23:59','2025-12-13 16:23:59'),(71,'TSK-10022','Demo Task for today','xyz',NULL,1,29,'High','New','2025-12-18','Notification check kro','2025-12-14','2025-12-14 18:03:40','2025-12-18 06:48:02'),(72,'TSK-10023','Client visit',NULL,NULL,3,1,'High','New','2025-12-18',NULL,'2025-12-15','2025-12-15 05:14:58','2025-12-18 06:49:08');
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
  `role` enum('Admin','HR','Site Manager','Office Staff','Field Rep') DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `profile_image` text DEFAULT NULL,
  `is_temp_password` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Deepak','Vaishnav','deepak.divaishnav1996@gmail.com','919876543210','deepak_admin','admin123','2025-12-10 06:51:28','2025-12-17 11:19:19','Admin','Active',NULL,0),(3,'Priya','Sharma','priya.sharma@example.com','919876543211','priya_manager','admin123','2025-12-10 07:15:42','2025-12-18 06:49:31','HR','Active',NULL,0),(6,'Vikram','Gupta','vikram.gupta@example.com','919876543214','vikram_worker','admin123','2025-12-10 07:15:42','2025-12-17 11:59:07','Site Manager','Active',NULL,0),(29,'Raju ','Ramanuj','Raju123@gmail.com','916765765799','Raju123','admin123','2025-12-17 12:34:38','2025-12-17 17:01:06','Site Manager','Active','data:image/png;base64,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',0),(30,'Harshita','Sharma','HarshitaSharma@gmail.com','913432443424','HarshitaSharma','pZmfV3Sy','2025-12-18 05:25:47','2025-12-18 05:25:47','Field Rep','Active',NULL,1);
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

-- Dump completed on 2025-12-18 12:58:51
