package repository

import (
	"database/sql"
	"fmt"
	"net/http"

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

func (l *LikeRepository) InsertPostLike(postLike PostLike) error {
	sqlStmt := `INSERT INTO post_likes (post_id, user_id) VALUES (?, ?);`
	_, err := l.db.Exec(sqlStmt, postLike.PostID, postLike.UserID)
	return err
}

func (l *LikeRepository) DeletePostLike(postLike PostLike) (int, error) {
	sqlStmt := `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?;`
	result, err := l.db.Exec(sqlStmt, postLike.PostID, postLike.UserID)
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

func (l *LikeRepository) CountPostLike(postID int) (int, error) {
	sqlStmt := `SELECT COUNT(*) FROM post_likes WHERE post_id = ?;`
	result := l.db.QueryRow(sqlStmt, postID)

	var totalLike int
	err := result.Scan(&totalLike)
	if err != nil {
		return 0, err
	}

	return totalLike, nil
}

func (l *LikeRepository) InsertCommentLike(commentLike CommentLike) error {
	sqlStmt := `INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?);`
	_, err := l.db.Exec(sqlStmt, commentLike.CommentID, commentLike.UserID)
	return err
}

func (l *LikeRepository) DeleteCommentLike(commentLike CommentLike) (int, error) {
	sqlStmt := `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?;`
	result, err := l.db.Exec(sqlStmt, commentLike.CommentID, commentLike.UserID)
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

func (l *LikeRepository) CountCommentLike(postID int) (int, error) {
	sqlStmt := `SELECT COUNT(*) FROM comment_likes WHERE post_id = ?;`
	result := l.db.QueryRow(sqlStmt, postID)

	var totalLike int
	err := result.Scan(&totalLike)
	if err != nil {
		return 0, err
	}

	return totalLike, nil
}
