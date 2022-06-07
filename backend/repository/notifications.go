package repository

import (
	"database/sql"

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
