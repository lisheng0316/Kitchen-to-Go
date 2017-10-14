CREATE TABLE users (
	userId varchar NOT NULL,
	email varchar NOT NULL,
	firstName varchar NOT NULL,
	lastName varchar NOT NULL,
	password varchar NOT NULL,
	phone varchar NOT NULL,
	PRIMARY KEY (userId)
);

CREATE TABLE session (
	userId varchar NOT NULL,
	token varchar,
	session_time varchar,
	PRIMARY KEY (userId, token),
	FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE cooks (
	userId varchar NOT NULL,
	cookerId varchar NOT NULL,
	address1 varchar NOT NULL,
	address2 varchar,
	city varchar NOT NULL,
	province varchar NOT NULL,
	postalCode varchar NOT NULL,
	country varchar NOT NULL,
	PRIMARY KEY (userId, cookerId), 
	FOREIGN KEY (userId) REFERENCES users (userId) ON DELETE CASCADE ON UPDATE CASCADE
);

BEGIN;

ALTER TABLE cooks ADD COLUMN updated_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp();

ALTER TABLE cooks ADD COLUMN created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp();


CREATE OR REPLACE FUNCTION update_row_updated_function_()
RETURNS TRIGGER 
AS 
$$
BEGIN
    -- ASSUMES the table has a column named exactly "row_modified_".
    -- Fetch date-time of actual current moment from clock, rather than start of statement or start of transaction.
    NEW.updated_on = clock_timestamp(); 
    RETURN NEW;
END;
$$ 
language 'plpgsql';

CREATE TRIGGER row_upd_on_customer_trigger_
BEFORE UPDATE
ON cooks 
FOR EACH ROW 
EXECUTE PROCEDURE update_row_updated_function_();

COMMIT;