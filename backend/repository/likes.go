package repository

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type LikeRepository struct {
	db *sql.DB
}

func NewLikeRepository(db *sql.DB) *LikeRepository {
	return &LikeRepository{
		db: db,
	}
}
