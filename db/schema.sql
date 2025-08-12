-- MySQL schema for Library Management System (updated)
CREATE TABLE IF NOT EXISTS `book` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `isbn` VARCHAR(100),
  `available` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `library_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `borrow_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `book_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `borrow_date` DATETIME NOT NULL,
  `return_date` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`book_id`) REFERENCES `book`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `library_user`(`id`)
);
