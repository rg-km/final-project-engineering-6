package main

import (
	"database/sql"

	"github.com/rg-km/final-project-engineering-6/api"
	"github.com/rg-km/final-project-engineering-6/repository"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "basis-app.db")
	if err != nil {
		panic(err)
	}

	commentRepo := repository.NewCommentRepository(db)
	likeRepo := repository.NewLikeRepository(db)
	notifRepo := repository.NewNotificationRepository(db)
	postsRepo := repository.NewPostRepository(db)
	userRepo := repository.NewUserRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)

	mainAPI := api.NewAPI(*commentRepo, *likeRepo, *notifRepo, *postsRepo, *userRepo, *categoryRepo)
	mainAPI.Start()
}
