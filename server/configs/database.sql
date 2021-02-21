CREATE DATABASE IF NOT EXISTS `HyperTube`;
USE `HyperTube`;
CREATE TABLE IF NOT EXISTS `Users` (
    `userID` INT AUTO_INCREMENT PRIMARY KEY,
	`githubID` VARCHAR(40),
	`googleID` VARCHAR(40),
	`42ID` VARCHAR(40),
    `userName` VARCHAR(40),
    `email` VARCHAR(100),
    `firstName` VARCHAR(25),
    `lastName` VARCHAR(25),
    `password` VARCHAR(60),
	`image` VARCHAR(255),
	`token` VARCHAR(172),
    `isActive` INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS `Comments` (
    `commentID` INT AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `imdbID` VARCHAR(10) NOT NULL,
    `commentContent` VARCHAR(100) NOT NULL,
	`date` DATETIME DEFAULT NOW(),
    FOREIGN KEY (userID) REFERENCES `Users`(userID)
);