package repository

import (
	"database/sql"
	"errors"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type PostDetail struct {
	ID                int            `db:"id"`
	AuthorID          int            `db:"author_id"`
	AuthorName        string         `db:"author_name"`
	AuthorRole        string         `db:"author_role"`
	AuthorAvatar      sql.NullString `db:"author_avatar"`
	AuthorInstitution sql.NullString `db:"author_institution"`
	AuthorMajor       sql.NullString `db:"author_major"`
	CategoryID        int            `db:"category_id"`
	Title             string         `db:"title"`
	Description       string         `db:"desc"`
	CreatedAt         time.Time      `db:"created_at"`
	ImageID           sql.NullInt32  `db:"image_id"`
	ImagePath         sql.NullString `db:"image_path"`
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

func (p *PostRepository) InsertPost(authorID, categoryID int, title, description string) (int64, error) {
	sqlStatement := `
    INSERT INTO posts (author_id, category_id, title, desc, created_at) VALUES
    (?, ?, ?, ?, ?);
  `

	tx, err := p.db.Begin()

	if err != nil {
		return 0, err
	}

	defer tx.Rollback()

	result, err := tx.Exec(sqlStatement, authorID, categoryID, title, description, time.Now())

	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()

	if err != nil {
		return 0, err
	}

	if err := tx.Commit(); err != nil {
		return 0, err
	}

	return id, nil
}

func (p *PostRepository) InsertPostImage(postID int, path string) error {
	sqlStatement := `
		INSERT INTO post_images (post_id, path) VALUES (?, ?);
	`
	tx, err := p.db.Begin()

	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, error := tx.Exec(sqlStatement, postID, path)

	if error != nil {
		return err
	}

	if error := tx.Commit(); error != nil {
		return err
	}

	return nil
}

func (p *PostRepository) FetchAllPost(limit, offset int) ([]PostDetail, error) {
	sqlStatement := `
	SELECT 
	up.id,
	up.author_id,
	up.author_name,
	up.author_role,
	up.author_avatar,
	up.author_institution,
	up.author_major,
	up.category_id,
	up.title,
	up.desc,
	up.created_at,
	pi.id as image_id,
	pi.path as image_path
FROM (
	SELECT
	p.id as id,
	u.id as author_id,
	u.name as author_name,
	u.role as author_role,
	u.avatar as author_avatar,
	ud.institute as author_institution,
	ud.major as author_major,
	p.category_id as category_id,
	p.title as title,
	p.desc as desc,
	p.created_at as created_at
	FROM posts p
	INNER JOIN users u ON p.author_id = u.id
	LEFT JOIN user_details ud ON u.id = ud.user_id
	ORDER BY created_at DESC
	LIMIT ? OFFSET ?
) up
LEFT JOIN post_images pi ON up.id = pi.post_id;`

	tx, err := p.db.Begin()

	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	rows, err := tx.Query(sqlStatement, limit, offset)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var posts []PostDetail
	for rows.Next() {
		var post PostDetail
		err := rows.Scan(
			&post.ID,
			&post.AuthorID, &post.AuthorName, &post.AuthorRole, &post.AuthorAvatar, &post.AuthorInstitution, &post.AuthorMajor,
			&post.CategoryID, &post.Title, &post.Description, &post.CreatedAt,
			&post.ImageID, &post.ImagePath)

		if err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (p *PostRepository) FetchPostByID(postID int) ([]PostDetail, error) {
	var (
		posts        []PostDetail
		sqlStatement string
	)

	sqlStatement = `
		SELECT 
			p.id as id,
			u.id as author_id,
			u.name as author_name,
			u.role as author_role,
			u.avatar as author_avatar,
			ud.institute as author_institution,
			ud.major as author_major,
			p.category_id as category_id,
			p.title as title,
			p.desc as desc,
			p.created_at as created_at,
			pi.id as image_id,
			pi.path as image_path
		FROM posts p
		INNER JOIN users u ON p.author_id = u.id
		LEFT JOIN user_details ud ON u.id = ud.user_id
		LEFT JOIN post_images pi ON p.id = pi.post_id
		WHERE p.id = ?;
	`

	tx, err := p.db.Begin()

	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	rows, err := tx.Query(sqlStatement, postID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var post PostDetail
		err := rows.Scan(
			&post.ID,
			&post.AuthorID, &post.AuthorName, &post.AuthorRole, &post.AuthorAvatar, &post.AuthorInstitution, &post.AuthorMajor,
			&post.CategoryID, &post.Title, &post.Description, &post.CreatedAt,
			&post.ImageID, &post.ImagePath)

		if err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (p *PostRepository) FetchAuthorIDByPostID(postID int) (int, error) {
	sqlStatement := `
		SELECT author_id FROM posts WHERE id = ?;
	`

	tx, err := p.db.Begin()

	if err != nil {
		return 0, err
	}

	defer tx.Rollback()

	var authorID int
	err = tx.QueryRow(sqlStatement, postID).Scan(&authorID)

	if err != nil {
		if err == sql.ErrNoRows {
			return 0, ErrPostNotFound
		}

		return 0, err
	}

	if err := tx.Commit(); err != nil {
		return 0, err
	}

	return authorID, nil
}

func (p *PostRepository) UpdatePost(postID, categoryID int, title, description string) error {
	sqlStatement := `
		UPDATE posts SET category_id = ?, title = ?, desc = ? WHERE id = ?;
	`

	tx, err := p.db.Begin()

	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(sqlStatement, categoryID, title, description, postID)

	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (p *PostRepository) DeletePostByID(postID int) error {
	sqlStatement := `DELETE FROM posts WHERE id = ?;`

	tx, err := p.db.Begin()

	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(sqlStatement, postID)

	if err != nil {
		return err
	}

	_, err = tx.Exec(`DELETE FROM post_images WHERE post_id = ?;`, postID)

	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
