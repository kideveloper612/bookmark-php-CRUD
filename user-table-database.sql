CREATE TABLE users (
  idUsers int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
  uidUsers TINYTEXT NOT NULL,
  emailUsers TINYTEXT NOT NULL,
  pwdUsers LONGTEXT NOT NULL
);


CREATE TABLE bookmarks (
  idUsers int(11) NOT NULL,
  category TINYTEXT NOT NULL,
  name TINYTEXT NOT NULL,
  adress LONGTEXT NOT NULL
);
