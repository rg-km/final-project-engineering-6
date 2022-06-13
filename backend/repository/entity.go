package repository

import "time"

type Comment struct {
	ID              int        `json:"id"`
	PostID          int        `json:"post_id"`
	ParentCommentID *int       `json:"parent_comment_id"`
	Comment         string     `json:"comment"`
	CreatedAt       *time.Time `json:"created_at"`
	AuthorID        int        `json:"author_id"`
	AuthorName      string     `json:"author_name" db:"author_name"`
	TotalLike       int        `json:"total_like"`
	TotalReply      int        `json:"total_reply"`
	Reply           []Comment  `json:"reply"`
}

type PostLike struct {
	ID     int
	PostID int
	UserID int
}

type CommentLike struct {
	ID        int
	CommentID int
	UserID    int
}
