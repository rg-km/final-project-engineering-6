package repository

import (
	"database/sql"
	"fmt"

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

func (l *LikeRepository) DeletePostLike(postLike PostLike) error {
	sqlStmt := `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?;`
	_, err := l.db.Exec(sqlStmt, postLike.PostID, postLike.UserID)
	return err
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

func (l *LikeRepository) CheckPostLikeIsExist(postLike PostLike) (bool, error) {
	sqlStmt := `
	SELECT  
		COUNT(*)
	FROM post_likes
	WHERE post_id = ? AND user_id = ?;`
	result := l.db.QueryRow(sqlStmt, postLike.PostID, postLike.UserID)

	var totalLike int
	err := result.Scan(&totalLike)
	if err != nil {
		return false, err
	}

	fmt.Println(totalLike)
	if totalLike == 1 {
		return true, nil
	} else {
		return false, nil
	}
}

func (l *LikeRepository) InsertCommentLike(commentLike CommentLike) error {
	sqlStmt := `INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?);`
	_, err := l.db.Exec(sqlStmt, commentLike.CommentID, commentLike.UserID)
	return err
}

func (l *LikeRepository) DeleteCommentLike(commentLike CommentLike) error {
	sqlStmt := `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?;`
	_, err := l.db.Exec(sqlStmt, commentLike.CommentID, commentLike.UserID)
	return err
}

func (l *LikeRepository) CountCommentLike(commentID int) (int, error) {
	sqlStmt := `SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?;`
	result := l.db.QueryRow(sqlStmt, commentID)

	var totalLike int
	err := result.Scan(&totalLike)
	if err != nil {
		return 0, err
	}

	return totalLike, nil
}

func (l *LikeRepository) CheckCommentLikeIsExist(commentLike CommentLike) (bool, error) {
	sqlStmt := `
	SELECT  
		COUNT(*)
	FROM comment_likes
	WHERE comment_id = ? AND user_id = ?;`
	result := l.db.QueryRow(sqlStmt, commentLike.CommentID, commentLike.UserID)

	var totalLike int
	err := result.Scan(&totalLike)
	if err != nil {
		return false, err
	}

	if totalLike == 1 {
		return true, nil
	} else {
		return false, nil
	}
}
