package repository

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

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

func (c *CommentRepository) SelectAllCommentsByParentCommentID(parentCommentID int) ([]Comment, error) {
	sqlStmt := `
	SELECT
		c.*,
		u.name as author_name
	FROM comments c
	LEFT JOIN users u ON c.author_id = u.id
	WHERE c.comment_id = ?
	ORDER BY c.created_at;`

	rows, err := c.db.Query(sqlStmt, parentCommentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	comments := []Comment{}
	for rows.Next() {
		var comment Comment

		err := rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.AuthorID,
			&comment.ParentCommentID,
			&comment.Comment,
			&comment.CreatedAt,
			&comment.AuthorName,
		)
		if err != nil {
			return []Comment{}, err
		}

		reply, _ := c.SelectAllCommentsByParentCommentID(comment.ID)
		comment.Reply = reply

		comments = append(comments, comment)
	}

	return comments, nil
}

func (c *CommentRepository) SelectAllCommentsByPostID(postID int) ([]Comment, error) {
	sqlStmt := `
	SELECT
		c.*,
		u.name as author_name
	FROM comments c
	LEFT JOIN users u ON c.author_id = u.id
	WHERE c.post_id = ? AND c.comment_id ISNULL
	ORDER BY c.created_at;`

	rows, err := c.db.Query(sqlStmt, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	comments := []Comment{}
	for rows.Next() {
		var comment Comment

		err := rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.AuthorID,
			&comment.ParentCommentID,
			&comment.Comment,
			&comment.CreatedAt,
			&comment.AuthorName,
		)
		if err != nil {
			return []Comment{}, err
		}

		reply, _ := c.SelectAllCommentsByParentCommentID(comment.ID)
		comment.Reply = reply

		comments = append(comments, comment)
	}

	return comments, nil
}

func (c *CommentRepository) InsertComment(comment Comment) error {
	sqlStmt := `INSERT INTO comments (post_id, author_id, comment, comment_id, created_at) VALUES (?, ?, ?, ?, ?);`
	_, err := c.db.Exec(sqlStmt, comment.PostID, comment.AuthorID, comment.Comment, comment.ParentCommentID, time.Now())
	return err
}

func (c *CommentRepository) UpdateComment(comment Comment) (int, error) {
	sqlStmt := `UPDATE comments SET comment = ? WHERE id = ?`

	result, err := c.db.Exec(sqlStmt, comment.Comment, comment.ID)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	count, err := result.RowsAffected()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	if count == 0 {
		return http.StatusBadRequest, fmt.Errorf("No data with given id")
	}

	return http.StatusOK, nil
}

func (c *CommentRepository) DeleteComment(commentID int) (int, error) {
	sqlStmt := `DELETE FROM comments WHERE id = ? OR comment_id = ?`

	result, err := c.db.Exec(sqlStmt, commentID, commentID)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	count, err := result.RowsAffected()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	if count == 0 {
		return http.StatusBadRequest, fmt.Errorf("No data with given id")
	}

	return http.StatusOK, nil
}

func (c CommentRepository) CountComment(postID int) (int, error) {
	sqlStmt := `SELECT COUNT(*) FROM comments WHERE post_id = ?;`
	result := c.db.QueryRow(sqlStmt, postID)

	var totalLike int
	err := result.Scan(&totalLike)
	if err != nil {
		return 0, err
	}

	return totalLike, nil
}
