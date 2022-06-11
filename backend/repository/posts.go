package repository

import (
	"database/sql"
	"errors"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Post struct {
	ID          int       `db:"id"`
	AuthorID    int       `db:"author_id"`
	CategoryID  int       `db:"category_id"`
	Title       string    `db:"title"`
	Description string    `db:"desc"`
	CreatedAt   time.Time `db:"created_at"`
}

type PostRepository struct {
	db *sql.DB
}

var (
	ErrPostNotFound = errors.New("Post not found")
)

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

func (p *PostRepository) FetchAllPost() ([]Post, error) {
	sqlStatement := `SELECT * FROM posts ORDER BY created_at DESC;`

	rows, err := p.db.Query(sqlStatement)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.ID, &post.AuthorID, &post.CategoryID, &post.Title, &post.Description, &post.CreatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, nil
}

func (p *PostRepository) FetchPostByID(postID int) (Post, error) {
	var (
		post         Post
		sqlStatement string
	)

	sqlStatement = `
		SELECT * FROM posts WHERE id = ?;
	`

	row := p.db.QueryRow(sqlStatement, postID)

	err := row.Scan(&post.ID, &post.AuthorID, &post.CategoryID, &post.Title, &post.Description, &post.CreatedAt)

	if err == sql.ErrNoRows {
		return post, ErrPostNotFound
	}

	return post, err
}

func (p *PostRepository) UpdatePost(postID, categoryID int, title, description string) error {
	sqlStatement := `
		UPDATE posts SET category_id = ?, title = ?, desc = ? WHERE id = ?;
	`

	result, err := p.db.Exec(sqlStatement, categoryID, title, description, postID)

	if err != nil {
		return err
	}

	count, err := result.RowsAffected()

	if err != nil {
		return err
	}

	if count == 0 {
		return ErrPostNotFound
	}

	return nil
}

func (p *PostRepository) DeletePostByID(postID int) error {
	sqlStatement := `DELETE FROM posts WHERE id = ?;`

	result, err := p.db.Exec(sqlStatement, postID)

	if err != nil {
		return err
	}

	count, err := result.RowsAffected()

	if err != nil {
		return err
	}

	if count == 0 {
		return ErrPostNotFound
	}

	return nil
}
