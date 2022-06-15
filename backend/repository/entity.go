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

type Notification struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	CommentID   int       `json:"comment_id"`
	PostID      int       `json:"post_id"`
	AlreadyRead bool      `json:"already_read"`
	CreatedAt   time.Time `json:"created_at"`
}

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type User struct {
	Id        int     `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Role      string  `json:"role"`
	Institute string  `json:"institute"`
	Major     string  `json:"major"`
	Batch     int     `json:"batch"`
	Avatar    *string `json:"avatar"`
}
