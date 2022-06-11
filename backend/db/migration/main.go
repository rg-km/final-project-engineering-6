package main

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

// Run This Script for migration db
func main() {
	db, err := sql.Open("sqlite3", "basis-app.db")
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS users (
    id integer not null primary key AUTOINCREMENT,
    name varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
	role varchar(255) not null
);

CREATE TABLE IF NOT EXISTS user_details (
    user_id integer NOT NULL,
	institute varchar(255) NOT NULL,
	major varchar(255) NULL,
	semester smallint UNSIGNED NULL,
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

INSERT INTO users(id, name, email, password, role) VALUES 
	(1, "nadhif", "nadhif@example.com", "password", "mahasiswa");

INSERT INTO comments(id, post_id, author_id, comment, comment_id, created_at) VALUES 
	(1, 1, 1, "Comment 1", NULL, "2022-06-11 19:33:02.3861157+07:00"),
	(2, 1, 1, "Comment 2", 1, "2022-06-11 19:33:02.3861157+07:00"),
	(3, 1, 1, "Comment 3", 1, "2022-06-11 19:33:02.3861157+07:00"),
	(4, 1, 1, "Comment 4", NULL, "2022-06-11 19:33:02.3861157+07:00"),
	(5, 1, 1, "Comment 5", 4, "2022-06-11 19:33:02.3861157+07:00"),
	(6, 1, 1, "Comment 6", 4, "2022-06-11 19:33:02.3861157+07:00"),
	(7, 1, 1, "Comment 7", 6, "2022-06-11 19:33:02.3861157+07:00");
`)

	if err != nil {
		panic(err)
	}
}
