package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rg-km/final-project-engineering-6/helper"
	"github.com/rg-km/final-project-engineering-6/repository"
	"net/http"
)

type PostLikeRequest struct {
	PostID int `json:"post_id" binding:"required,number"`
	UserID int `json:"user_id" binding:"required,number"`
}

type CommentLikeRequest struct {
	CommentID int `json:"comment_id" binding:"required,number"`
	UserID    int `json:"user_id" binding:"required,number"`
}

func (api API) CreatePostLike(c *gin.Context) {
	var postLikeRequest PostLikeRequest
	err := c.ShouldBind(&postLikeRequest)
	if err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"errors": helper.GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
		}
		return
	}

	isExist, err := api.likeRepo.CheckPostLikeIsExist(repository.PostLike{
		PostID: postLikeRequest.PostID,
		UserID: postLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}
	if isExist {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": "User with given id already like this post"},
		)
		return
	}

	err = api.likeRepo.InsertPostLike(repository.PostLike{
		PostID: postLikeRequest.PostID,
		UserID: postLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
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
				gin.H{"errors": helper.GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
		}
		return
	}

	isExist, err := api.likeRepo.CheckPostLikeIsExist(repository.PostLike{
		PostID: postLikeRequest.PostID,
		UserID: postLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}
	if !isExist {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": "No data with given id"},
		)
		return
	}

	err = api.likeRepo.DeletePostLike(repository.PostLike{
		PostID: postLikeRequest.PostID,
		UserID: postLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
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
				gin.H{"errors": helper.GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
		}
		return
	}

	isExist, err := api.likeRepo.CheckCommentLikeIsExist(repository.CommentLike{
		CommentID: commentLikeRequest.CommentID,
		UserID:    commentLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}
	if isExist {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": "User with given id already like this comment"},
		)
		return
	}

	err = api.likeRepo.InsertCommentLike(repository.CommentLike{
		CommentID: commentLikeRequest.CommentID,
		UserID:    commentLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
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
				gin.H{"errors": helper.GetErrorMessage(ve)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
		}
		return
	}

	isExist, err := api.likeRepo.CheckCommentLikeIsExist(repository.CommentLike{
		CommentID: commentLikeRequest.CommentID,
		UserID:    commentLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}
	if !isExist {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": "User with given id already like this comment"},
		)
		return
	}

	err = api.likeRepo.DeleteCommentLike(repository.CommentLike{
		CommentID: commentLikeRequest.CommentID,
		UserID:    commentLikeRequest.UserID,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Delete Comment Like Successful",
	})
}
