package repository

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{
		db: db,
	}
}
