CREATE TABLE users (
	user_id varchar NOT NULL,
	email varchar NOT NULL,
	firstname varchar NOT NULL,
	lastname varchar NOT NULL,
	password varchar NOT NULL,
	phone varchar NOT NULL,
	PRIMARY KEY (user_id),
	UNIQUE (email)
);

CREATE TABLE sessions (
	user_id varchar NOT NULL,
	token varchar,
	session_time varchar,
	device_id varchar,
	PRIMARY KEY (user_id, token),
	FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE cooks (
	user_id varchar NOT NULL,
	cooker_id varchar NOT NULL,
	address1 varchar NOT NULL,
	address2 varchar,
	city varchar NOT NULL,
	province varchar NOT NULL,
	postalcode varchar NOT NULL,
	country varchar NOT NULL,
	UNIQUE (user_id),
	PRIMARY KEY (user_id, cooker_id), 
	FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
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