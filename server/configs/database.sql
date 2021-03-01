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
CREATE TABLE IF NOT EXISTS `Favorites` (
    `favoriteID` INT AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `imdbID` VARCHAR(10) NOT NULL,
    `movieTitle` VARCHAR(100) NOT NULL,
    `movieImage` VARCHAR(100) NOT NULL,
    `movieDescription` VARCHAR(512),
    `movieLanguage` VARCHAR(10) NOT NULL,
    `movieRelease` VARCHAR(4) NOT NULL,
    `movieTime` INT NOT NULL,
    `movieGender` VARCHAR(255) NOT NULL,
    FOREIGN KEY (userID) REFERENCES `Users`(userID)
);
CREATE TABLE IF NOT EXISTS `Viewed` (
    `viewedID` INT AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `imdbID` VARCHAR(10) NOT NULL,
	`date` DATETIME DEFAULT NOW(),
    FOREIGN KEY (userID) REFERENCES `Users`(userID)
);
CREATE TABLE IF NOT EXISTS `Movies` (
    `movieID` INT AUTO_INCREMENT PRIMARY KEY,
    `imdbID` VARCHAR(10) NOT NULL,
    `torrentHash` VARCHAR(100) NOT NULL,
    `path` VARCHAR(255)
);