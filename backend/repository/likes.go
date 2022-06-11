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
