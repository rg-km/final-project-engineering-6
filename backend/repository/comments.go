package repository

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type CommentRepository struct {
	db *sql.DB
}

func NewCommentRepository(db *sql.DB) *CommentRepository {
	return &CommentRepository{
		db: db,
	}
}
