package migration

import (
	"database/sql"

	"github.com/rg-km/final-project-engineering-6/db/seeder"

	_ "github.com/mattn/go-sqlite3"
)

// Run This Script for migration db
func Migrate(db *sql.DB) {

	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS users (
    id integer not null primary key AUTOINCREMENT,
    name varchar(255) not null,
    email varchar(255) not null UNIQUE,
    password varchar(255) not null,
	role varchar(255) not null,
	avatar varchar(255) null
);

CREATE TABLE IF NOT EXISTS user_details (
    user_id integer NOT NULL,
	institute varchar(255) NOT NULL,
	major varchar(255) NULL,
	batch smallint UNSIGNED NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories(
	id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	name varchar(255) not null
);

CREATE TABLE IF NOT EXISTS posts(
	id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	author_id integer NOT NULL,
	category_id integer NOT NULL,
	title varchar(255) NOT NULL,
	desc text NOT NULL,
	created_at datetime NOT NULL,
	FOREIGN KEY (author_id) REFERENCES users(id),
	FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS questionnaires(
	post_id integer NOT NULL,
	link varchar(255) NOT NULL,
	reward varchar(255) NULL,
	FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS post_images(
    id integer not null primary key AUTOINCREMENT,
	post_id integer NOT NULL,
	path varchar(255) NOT NULL,
	FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS post_likes(
    id integer not null primary key AUTOINCREMENT,
	post_id integer NOT NULL,
	user_id integer NOT NULL,
	FOREIGN KEY (post_id) REFERENCES posts(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments(
	id integer not null primary key AUTOINCREMENT,
	post_id integer NOT NULL,
	author_id integer NOT NULL,
	comment_id integer NULL,
	comment text NOT NULL,
	created_at datetime NOT NULL,
	FOREIGN KEY (post_id) REFERENCES posts(id),
	FOREIGN KEY (author_id) REFERENCES users(id),
	FOREIGN KEY (comment_id) REFERENCES comments(id)
);

CREATE TABLE IF NOT EXISTS comment_likes(
    id integer not null primary key AUTOINCREMENT,
	comment_id integer NOT NULL,
	user_id integer NOT NULL,
	FOREIGN KEY (comment_id) REFERENCES comments(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications(
    id integer not null primary key AUTOINCREMENT,
	comment_id integer NOT NULL,
	user_id integer NOT NULL,
	already_read tinyint(1) NOT NULL DEFAULT 0,
	created_at datetime NOT NULL,
	FOREIGN KEY (comment_id) REFERENCES comments(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);
`)

	if err != nil {
		panic(err)
	}

	seeder.Seed(db)
}
