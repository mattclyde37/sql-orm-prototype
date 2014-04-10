DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Quote;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS User;


CREATE TABLE User
(
    id char(36) NOT NULL,
    username character varying(64),
    password character varying(64),
    role_code character varying (1),
    PRIMARY KEY (id)
);


CREATE TABLE Person
(
    id char(36) NOT NULL,
    name character varying (128),
    context character varying (128),
    PRIMARY KEY (id)
);

CREATE TABLE Quote
(
    id char(36) NOT NULL,
    text character varying (4096),
    character_id char(36),
    user_id char(36),
    added_on datetime,
    PRIMARY KEY (id),
    FOREIGN KEY (character_id) REFERENCES Person(id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE Comment
(
    id char(36) NOT NULL,
    text character varying (4096),
    quote_id char(36),
    user_id char(36),
    PRIMARY KEY (id),
    FOREIGN KEY (quote_id) REFERENCES Quote (id),
    FOREIGN KEY (user_id) REFERENCES User (id)
);


INSERT INTO User VALUES('18e35395-c0a7-4d78-b801-73bb08535d63', 'admin', 'admin', 'a');
INSERT INTO User VALUES('12345678-c0a7-4d78-b801-73bb87654321', 'matt', 'testing', 'a');





