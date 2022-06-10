package repository

import (
	"database/sql"
	"time"

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

func (p *PostRepository) InsertPost(authorID, categoryID int, title, description string) error {
	sqlStatement := `
    INSERT INTO posts (author_id, category_id, title, desc, created_at) VALUES
    (?, ?, ?, ?, ?);
  `

	_, err := p.db.Exec(sqlStatement, authorID, categoryID, title, description, time.Now())

	return err
}
