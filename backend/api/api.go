package api

import (
	"fmt"
	"net/http"

	"github.com/rg-km/final-project-engineering-6/repository"
)

type API struct {
	commentRepo repository.CommentRepository
	likeRepo    repository.LikeRepository
	notifRepo   repository.NotificationRepository
	postRepo    repository.PostRepository
	userRepo    repository.UserRepository
	mux         *http.ServeMux
}

func NewAPI(commentRepo repository.CommentRepository, likeRepo repository.LikeRepository, notifRepo repository.NotificationRepository, postRepo repository.PostRepository, userRepo repository.UserRepository) API {
	mux := http.NewServeMux()
	api := API{
		mux:         mux,
		commentRepo: commentRepo,
		likeRepo:    likeRepo,
		notifRepo:   notifRepo,
		postRepo:    postRepo,
		userRepo:    userRepo,
	}

	return api
}

func (api *API) Handler() *http.ServeMux {
	return api.mux
}

func (api *API) Start() {
	fmt.Println("starting web server at http://localhost:8080/")
	http.ListenAndServe(":8080", api.Handler())
}
