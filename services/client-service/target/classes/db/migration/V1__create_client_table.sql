CREATE TABLE clients
(
    id BIGSERIAL PRIMARY KEY,

    client_number VARCHAR(30) UNIQUE NOT NULL,

    auth_user_id BIGINT NOT NULL,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100),

    gender VARCHAR(20),

    date_of_birth DATE,

    mobile_number VARCHAR(15) NOT NULL,

    email VARCHAR(150),

    aadhaar_number VARCHAR(20) UNIQUE,

    pan_number VARCHAR(20) UNIQUE,

    occupation VARCHAR(100),

    monthly_income NUMERIC(15,2),

    marital_status VARCHAR(20),

    address_line1 VARCHAR(255),

    address_line2 VARCHAR(255),

    city VARCHAR(100),

    state VARCHAR(100),

    postal_code VARCHAR(20),

    country VARCHAR(100),

    kyc_status BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);