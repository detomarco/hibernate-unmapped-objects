use `huo`;

CREATE TABLE IF NOT EXISTS `SimpleEntity`
(
    `id`             VARCHAR(36) PRIMARY KEY,
    `date`           TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    `field`          VARCHAR(36) DEFAULT NULL,
    `who`            VARCHAR(36) NOT NULL,
    `unmappedColumn` VARCHAR(36) NOT NULL
);


CREATE TABLE IF NOT EXISTS `Tables`
(
    `id` VARCHAR(36) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS `UnmappedTable`
(
    `id` VARCHAR(36) PRIMARY KEY
);
