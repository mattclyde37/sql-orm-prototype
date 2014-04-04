DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Character;
DROP TABLE IF EXISTS Quote;
DROP TABLE IF EXISTS Comment;

CREATE TABLE User
(
    id uuid primary key not null,
    username character varying(64),
    password character varying(64),
    role_code character varying (1)
);


CREATE TABLE Character
(
    id uuid primary key not null,
    name character varying (128),
    context character varying (128)
);

CREATE TABLE Quote
(
    id uuid primary key not null,
    text character varying (4096),
    character_id uuid REFERENCES Character (id),
    user_id uuid REFERENCES User (id)
);

CREATE TABLE Comment
(
    id uuid,
    text character varying (4096),
    quote_id uuid REFERENCES Quote (id),
    user_id uuid REFERENCES User (id)
);


INSERT INTO User VALUES('18e35395-c0a7-4d78-b801-73bb08535d63', 'admin', 'admin', 'a');
INSERT INTO User VALUES('12345678-c0a7-4d78-b801-73bb87654321', 'matt', 'testing', 'a');


