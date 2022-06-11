package repository

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
