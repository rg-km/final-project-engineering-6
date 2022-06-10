package api

import (
	"github.com/gin-gonic/gin"
	"github.com/rg-km/final-project-engineering-6/repository"
)

type API struct {
	commentRepo repository.CommentRepository
	likeRepo    repository.LikeRepository
	notifRepo   repository.NotificationRepository
	postRepo    repository.PostRepository
	userRepo    repository.UserRepository
	router      *gin.Engine
}

func NewAPI(commentRepo repository.CommentRepository, likeRepo repository.LikeRepository, notifRepo repository.NotificationRepository, postRepo repository.PostRepository, userRepo repository.UserRepository) API {
	router := gin.Default()
	api := API{
		router:      router,
		commentRepo: commentRepo,
		likeRepo:    likeRepo,
		notifRepo:   notifRepo,
		postRepo:    postRepo,
		userRepo:    userRepo,
	}

	postRouter := router.Group("/api/post")
	{
		postRouter.POST("/", api.createPost)
		postRouter.GET("/", api.readPosts)
		postRouter.GET("/:id", api.readPost)
		postRouter.PUT("/", api.updatePost)
		postRouter.DELETE("/:id", api.deletePost)
	}

	return api
}

func (api *API) Handler() *gin.Engine {
	return api.router
}

func (api *API) Start() {
	api.Handler().Run()
}
