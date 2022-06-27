package repository

import (
	"database/sql"
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

func (c *CommentRepository) SelectAllCommentsByParentCommentID(out chan<- []Comment, errOut chan<- error, userID, parentCommentID int) {
	sqlStmt := `
	SELECT
		c.*,
		u.name as author_name,
		u.avatar as author_avatar,
		(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) AS total_like,
		(SELECT EXISTS (SELECT 1 FROM comment_likes WHERE comment_id = c.id AND user_id = ?)) AS is_like
	FROM comments c
	LEFT JOIN users u ON c.author_id = u.id
	WHERE c.comment_id = ?
	ORDER BY c.created_at;`

	rows, err := c.db.Query(sqlStmt, userID, parentCommentID)
	if err != nil {
		errOut <- err
		return
	}
	defer rows.Close()

	ch := make(chan []Comment)
	errCh := make(chan error)

	comments := []Comment{}
	for rows.Next() {
		var comment Comment

		err = rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.AuthorID,
			&comment.ParentCommentID,
			&comment.Comment,
			&comment.CreatedAt,
			&comment.AuthorName,
			&comment.AuthorAvatar,
			&comment.TotalLike,
			&comment.IsLike,
		)
		if err != nil {
			errOut <- err
			return
		}

		go c.SelectAllCommentsByParentCommentID(ch, errCh, userID, comment.ID)
		err = <-errCh
		if err != nil {
			errOut <- err
			return
		}

		reply := <-ch
		comment.Reply = reply
		comment.TotalReply = len(reply)

		if comment.AuthorID == userID {
			comment.IsAuthor = true
		}

		comments = append(comments, comment)
	}

	errOut <- nil
	out <- comments
	close(errCh)
	close(ch)
}

func (c *CommentRepository) SelectAllCommentsByPostID(userID, postID int) ([]Comment, error) {
	sqlStmt := `
	SELECT
		c.*,
		u.name as author_name,
		u.avatar as author_avatar,
		(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) AS total_like,
		(SELECT EXISTS (SELECT 1 FROM comment_likes WHERE comment_id = c.id AND user_id = ?)) AS is_like
	FROM comments c
	LEFT JOIN users u ON c.author_id = u.id
	WHERE c.post_id = ? AND c.comment_id ISNULL
	ORDER BY c.created_at;`

	rows, err := c.db.Query(sqlStmt, userID, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	ch := make(chan []Comment)
	errCh := make(chan error)

	comments := []Comment{}
	for rows.Next() {
		var comment Comment

		err = rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.AuthorID,
			&comment.ParentCommentID,
			&comment.Comment,
			&comment.CreatedAt,
			&comment.AuthorName,
			&comment.AuthorAvatar,
			&comment.TotalLike,
			&comment.IsLike,
		)
		if err != nil {
			return nil, err
		}

		go c.SelectAllCommentsByParentCommentID(ch, errCh, userID, comment.ID)
		err = <-errCh
		if err != nil {
			return nil, err
		}

		reply := <-ch
		comment.Reply = reply
		comment.TotalReply = len(reply)

		if comment.AuthorID == userID {
			comment.IsAuthor = true
		}

		comments = append(comments, comment)
	}

	close(errCh)
	close(ch)
	return comments, nil
}

func (c *CommentRepository) FetchCommentAuthorId(commentID int) (int, error) {
	sqlStmt := `
	SELECT author_id FROM comments WHERE id = ?;`

	var authorID int
	err := c.db.QueryRow(sqlStmt, commentID).Scan(&authorID)
	switch err {
	case sql.ErrNoRows:
		return 0, nil
	case nil:
		return authorID, nil
	default:
		return 0, err
	}
}

func (c *CommentRepository) InsertComment(comment Comment) (int64, error) {
	sqlStmt := `INSERT INTO comments (post_id, author_id, comment, comment_id, created_at) VALUES (?, ?, ?, ?, ?);`
	res, err := c.db.Exec(sqlStmt, comment.PostID, comment.AuthorID, comment.Comment, comment.ParentCommentID, time.Now())
	if err != nil {
		return -1, err
	}
	rowId, err := res.LastInsertId()
	return rowId, err
}

func (c *CommentRepository) UpdateComment(comment Comment) error {
	sqlStmt := `UPDATE comments SET comment = ? WHERE id = ?`
	_, err := c.db.Exec(sqlStmt, comment.Comment, comment.ID)
	return err
}

func (c *CommentRepository) DeleteComment(commentID int) error {
	sqlStmt := `DELETE FROM comments WHERE id = ? OR comment_id = ?`
	_, err := c.db.Exec(sqlStmt, commentID, commentID)
	return err
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
