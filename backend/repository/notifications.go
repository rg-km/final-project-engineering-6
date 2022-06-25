package repository

import (
	"database/sql"
	"errors"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type NotificationRepository struct {
	db *sql.DB
}

func NewNotificationRepository(db *sql.DB) *NotificationRepository {
	return &NotificationRepository{
		db: db,
	}
}

func (n NotificationRepository) CreateNotification(userId int, commentId int) error {
	_, err := n.db.Exec("INSERT INTO notifications (user_id, comment_id, created_at) VALUES (?, ?, ?)", userId, commentId, time.Now())
	return err
}

func (n NotificationRepository) GetAllNotifications(userId, page, limit int) ([]Notification, error) {
	rows, err := n.db.Query("SELECT notifications.id, users.name, notifications.comment_id, comments.post_id, posts.title, notifications.already_read, notifications.created_at FROM notifications JOIN comments ON notifications.comment_id = comments.id JOIN users ON users.id = comments.author_id JOIN posts ON posts.id = comments.post_id WHERE user_id = ? ORDER BY notifications.created_at DESC LIMIT ? OFFSET ?", userId, limit, (page-1)*limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []Notification
	for rows.Next() {
		var notification Notification
		if err := rows.Scan(&notification.ID, &notification.Name, &notification.CommentID, &notification.PostID, &notification.PostTitle, &notification.AlreadyRead, &notification.CreatedAt); err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}

	return notifications, nil
}

func (n NotificationRepository) SetReadNotification(userId int, notifId int) error {
	affected, err := n.db.Exec("UPDATE notifications SET already_read = 1 WHERE id = ? and user_id=?", notifId, userId)
	if rows, _ := affected.RowsAffected(); rows < 1 {
		return errors.New("no notification found")
	}
	return err
}

func (n NotificationRepository) SetReadAllNotification(userId int) error {
	affected, err := n.db.Exec("UPDATE notifications SET already_read = 1 WHERE user_id = ?", userId)
	if rows, _ := affected.RowsAffected(); rows < 1 {
		return errors.New("no notification found")
	}
	return err
}
