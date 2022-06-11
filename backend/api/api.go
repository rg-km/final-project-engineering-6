package api

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/rg-km/final-project-engineering-6/repository"
	"reflect"
	"strings"
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

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})
	}

	postLikeRouters := router.Group("/api/post-likes")
	{
		postLikeRouters.POST("/", api.CreatePostLike)
		postLikeRouters.DELETE("/", api.DeletePostLike)
	}

	commentLikeRouters := router.Group("/api/comment-likes")
	{
		commentLikeRouters.POST("/", api.CreateCommentLike)
		commentLikeRouters.DELETE("/", api.DeleteCommentLike)
	}

	return api
}

func (api *API) Handler() *gin.Engine {
	return api.router
}

func (api *API) Start() {
	api.Handler().Run()
}
