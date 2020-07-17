-------------------------------------------------------
DROP DATABASE IF EXISTS typoteka;
DROP USER IF EXISTS academy;
DROP TABLE IF EXISTS t_article;
DROP TABLE IF EXISTS t_user;
DROP TABLE IF EXISTS t_comment;
DROP TABLE IF EXISTS t_category;
DROP TABLE IF EXISTS t_article_t_category;
-------------------------------------------------------
CREATE USER academy
  WITH PASSWORD 'academy';

CREATE DATABASE typoteka
  WITH
  OWNER = academy
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;

GRANT ALL ON DATABASE typoteka TO academy;

GRANT TEMPORARY, CONNECT ON DATABASE typoteka TO PUBLIC;
-------------------------------------------------------
-- \c typoteka academy
-------------------------------------------------------
CREATE TABLE t_user (
  id bigserial PRIMARY KEY,
  name varchar(50) NOT NULL,
  avatar varchar(255),
  avatar_small varchar(255)
);
CREATE TABLE t_article (
  id bigserial PRIMARY KEY,
  title varchar(50) NOT NULL,
  created_date date NOT NULL,
  announce varchar(255) NOT NULL,
  sentences varchar(255) NOT NULL,
  img varchar(255),
  fk_t_user_id integer,
  FOREIGN KEY (fk_t_user_id) REFERENCES t_user (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
CREATE TABLE t_comment (
  id bigserial PRIMARY KEY,
  text text NOT NULL,
  fk_t_article_id integer,
  fk_t_user_id integer,
  FOREIGN KEY (fk_t_article_id) REFERENCES t_article (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  FOREIGN KEY (fk_t_user_id) REFERENCES t_user (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);
CREATE TABLE t_category (
  id bigserial PRIMARY KEY,
  label varchar(255) NOT NULL,
  fk_t_user_id integer,
  FOREIGN KEY (fk_t_user_id) REFERENCES t_user (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE t_article_t_category (
  article_id integer NOT NULL,
  category_id integer NOT NULL,
  CONSTRAINT pk_article_id_category_id PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES t_article (id),
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES t_category (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
-------------------------------------------------------
