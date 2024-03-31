-- table users
CREATE TABLE users
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- table refresh tokens
CREATE TABLE refresh_token
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT          NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    expired_at    DATETIME     NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- table permissions
CREATE TABLE permissions
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- table users_permissions
CREATE TABLE users_permissions
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT NOT NULL,
    permission_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
);

-- table shares
CREATE TABLE shares
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    path       VARCHAR(255) NOT NULL,
    password   VARCHAR(255),
    created_at DATETIME     NOT NULL,
    expires_at DATETIME     NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- table settings
CREATE TABLE settings
(
    id    INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL,
    value TEXT         NOT NULL
);

INSERT INTO settings (`key`, value)
VALUES ('view_register', 'false');
INSERT INTO settings (`key`, value)
VALUES ('user_default_path', 'true');



