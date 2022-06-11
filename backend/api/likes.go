package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rg-km/final-project-engineering-6/repository"
	"net/http"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

type PostLikeRequest struct {
	PostID int `json:"post_id" binding:"required,number"`
	UserID int `json:"user_id" binding:"required,number"`
}

type CommentLikeRequest struct {
	CommentID int `json:"comment_id" binding:"required,number"`
	UserID    int `json:"user_id" binding:"required,number"`
}

type JSONRequestErrorResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func (api API) CreatePostLike(c *gin.Context) {
	var postLikeRequest PostLikeRequest
	err := c.ShouldBind(&postLikeRequest)
	if err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"errors": GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
		}
		return
	}

	err = api.likeRepo.InsertPostLike(repository.PostLike{
		PostID: postLikeRequest.PostID,
		UserID: postLikeRequest.UserID,
	})
	defer func() {
		if err != nil {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
			return
		}
	}()
	if err != nil {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Add Post Like Successful",
	})
}

func (api API) DeletePostLike(c *gin.Context) {
	var postLikeRequest PostLikeRequest
	err := c.ShouldBind(&postLikeRequest)
	if err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"errors": GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
		}
		return
	}

	err = api.likeRepo.DeletePostLike(repository.PostLike{
		PostID: postLikeRequest.PostID,
		UserID: postLikeRequest.UserID,
	})
	defer func() {
		if err != nil {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
			return
		}
	}()
	if err != nil {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Delete Post Like Successful",
	})
}

func (api API) CreateCommentLike(c *gin.Context) {
	var commentLikeRequest CommentLikeRequest
	err := c.ShouldBind(&commentLikeRequest)
	if err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"errors": GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
		}
		return
	}

	err = api.likeRepo.InsertCommentLike(repository.CommentLike{
		CommentID: commentLikeRequest.CommentID,
		UserID:    commentLikeRequest.UserID,
	})
	defer func() {
		if err != nil {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
			return
		}
	}()
	if err != nil {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Add Comment Like Successful",
	})
}

func (api API) DeleteCommentLike(c *gin.Context) {
	var commentLikeRequest CommentLikeRequest
	err := c.ShouldBind(&commentLikeRequest)
	if err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"errors": GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
		}
		return
	}

	err = api.likeRepo.DeleteCommentLike(repository.CommentLike{
		CommentID: commentLikeRequest.CommentID,
		UserID:    commentLikeRequest.UserID,
	})
	defer func() {
		if err != nil {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				ErrorResponse{Error: err.Error()},
			)
			return
		}
	}()
	if err != nil {
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Delete Comment Like Successful",
	})
}

func GetErrorMessage(ve validator.ValidationErrors) []JSONRequestErrorResponse {
	out := make([]JSONRequestErrorResponse, len(ve))
	for i, fe := range ve {
		var message string
		switch fe.Tag() {
		case "required":
			message = "This field is required"
		case "number":
			message = "Should be a number"
		default:
			message = "Unknown error"
		}
		out[i] = JSONRequestErrorResponse{fe.Field(), message}
	}

	return out
}
