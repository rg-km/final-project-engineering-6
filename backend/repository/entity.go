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
	Reply           []Comment  `json:"reply"`
}
