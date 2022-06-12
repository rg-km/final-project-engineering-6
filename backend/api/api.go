package api

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"

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

	// Untuk validasi request dengan mengembalikan nama dari tag json jika ada
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})
	}

	router.Static("/media", "./media")

	router.POST("/api/login", api.login)
	router.POST("/api/register", api.register)

	profileRouter := router.Group("/api/profile", AuthMiddleware())
	{
		profileRouter.PUT("/avatar", api.changeAvatar)
	}

	router.GET("/api/post", api.readPosts)
	router.GET("/api/post/:id", api.readPost)
	postRouter := router.Group("/api/post", AuthMiddleware())
	{
		postRouter.POST("/", api.createPost)
		postRouter.POST("/images/:id", api.uploadPostImages)
		postRouter.PUT("/", api.updatePost)
		postRouter.DELETE("/:id", api.deletePost)
	}

	router.GET("/api/comments", api.ReadAllComment)
	commentRoutersWithAuth := router.Group("/api/comments", AuthMiddleware())
	{
		commentRoutersWithAuth.POST("/", api.CreateComment)
		commentRoutersWithAuth.PUT("/", api.UpdateComment)
		commentRoutersWithAuth.DELETE("/:id", api.DeleteComment)
	}

	postLikeRouters := router.Group("/api/post-likes", AuthMiddleware())
	{
		postLikeRouters.POST("/", api.CreatePostLike)
		postLikeRouters.DELETE("/", api.DeletePostLike)
	}

	commentLikeRouters := router.Group("/api/comment-likes", AuthMiddleware())
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
