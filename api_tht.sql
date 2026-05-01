/*
SQLyog Community v13.1.7 (64 bit)
MySQL - 8.0.30 : Database - api_tht
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `banners` */

DROP TABLE IF EXISTS `banners`;

CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_name` varchar(100) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `banners` */

insert  into `banners`(`id`,`banner_name`,`banner_image`,`description`) values 
(1,'Banner 1','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
(2,'Banner 2','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
(3,'Banner 3','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
(4,'Banner 4','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
(5,'Banner 5','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
(6,'Banner 6','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet');

/*Table structure for table `services` */

DROP TABLE IF EXISTS `services`;

CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_code` varchar(50) DEFAULT NULL,
  `service_name` varchar(100) DEFAULT NULL,
  `service_icon` varchar(255) DEFAULT NULL,
  `service_tariff` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_code` (`service_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `services` */

insert  into `services`(`id`,`service_code`,`service_name`,`service_icon`,`service_tariff`) values 
(1,'PAJAK','Pajak PBB','https://nutech-integrasi.app/dummy.jpg',40000),
(2,'PLN','Listrik','https://nutech-integrasi.app/dummy.jpg',10000),
(3,'PDAM','PDAM Berlangganan','https://nutech-integrasi.app/dummy.jpg',40000),
(4,'PULSA','Pulsa','https://nutech-integrasi.app/dummy.jpg',40000),
(5,'PGN','PGN Berlangganan','https://nutech-integrasi.app/dummy.jpg',50000),
(6,'MUSIK','Musik Berlangganan','https://nutech-integrasi.app/dummy.jpg',50000),
(7,'TV','TV Berlangganan','https://nutech-integrasi.app/dummy.jpg',50000),
(8,'PAKET_DATA','Paket data','https://nutech-integrasi.app/dummy.jpg',50000),
(9,'VOUCHER_GAME','Voucher Game','https://nutech-integrasi.app/dummy.jpg',100000),
(10,'VOUCHER_MAKANAN','Voucher Makanan','https://nutech-integrasi.app/dummy.jpg',100000),
(11,'QURBAN','Qurban','https://nutech-integrasi.app/dummy.jpg',200000),
(12,'ZAKAT','Zakat','https://nutech-integrasi.app/dummy.jpg',300000);

/*Table structure for table `transactions` */

DROP TABLE IF EXISTS `transactions`;

CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `transaction_type` varchar(20) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `service_code` varchar(50) DEFAULT NULL,
  `invoice_number` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `transactions` */

insert  into `transactions`(`id`,`user_id`,`transaction_type`,`amount`,`created_at`,`service_code`,`invoice_number`) values 
(1,3,'TOPUP',100000000,'2026-05-01 18:11:12',NULL,NULL),
(2,3,'TOPUP',100000000,'2026-05-01 18:11:35',NULL,NULL),
(3,3,'TOPUP',100000000,'2026-05-01 18:13:39',NULL,NULL),
(4,3,'PAYMENT',40000,'2026-05-01 18:18:12','PULSA','INV1777634292725');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `balance` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`password`,`balance`,`created_at`,`first_name`,`last_name`,`profile_image`) values 
(1,'test@mail.com','$2b$10$xsQTWDDyG7GGS91g5ihSluvulhqYUgeGbDjhF2T5XUU3Ty08EWuaS',0,'2026-05-01 15:17:11',NULL,NULL,NULL),
(2,'fitrizuyina014@mail.com','$2b$10$d4CZVO4IKRzy6myy5KRo5.QpGZoF095.iqv7fXMWK5DoVYlbqavOW',105000,'2026-05-01 15:17:57',NULL,NULL,NULL),
(3,'user@nutech-integrasi.com','$2b$10$s1ZPjkPuboKeuzv4jHIeie6DcKW4GUmqZgZeJyYsNA1Hk3D.m.uke',99960000,'2026-05-01 17:07:16','Fitri','Zuyina','http://localhost:3000/uploads/1777631024163-fitri zuyina na.jpg');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
