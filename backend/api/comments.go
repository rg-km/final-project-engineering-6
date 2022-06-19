package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rg-km/final-project-engineering-6/helper"
	"github.com/rg-km/final-project-engineering-6/repository"
)

type CreateCommentRequest struct {
	PostID          int    `json:"post_id" binding:"required,number"`
	ParentCommentID *int   `json:"parent_comment_id"`
	AuthorID        int    `json:"author_id" binding:"required,number"`
	Comment         string `json:"comment" binding:"required"`
}

type UpdateCommentRequest struct {
	CommentID int    `json:"comment_id" binding:"required,number"`
	Comment   string `json:"comment" binding:"required"`
}

func (api *API) ReadAllComment(c *gin.Context) {
	postID, err := strconv.Atoi(c.Query("postID"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	comments, err := api.commentRepo.SelectAllCommentsByPostID(postID)
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		comments,
	)
}

func (api API) CreateComment(c *gin.Context) {
	var createCommentRequest CreateCommentRequest
	err := c.ShouldBind(&createCommentRequest)
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

	commentId, err := api.commentRepo.InsertComment(repository.Comment{
		PostID:          createCommentRequest.PostID,
		ParentCommentID: createCommentRequest.ParentCommentID,
		AuthorID:        createCommentRequest.AuthorID,
		Comment:         createCommentRequest.Comment,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	var authorId int

	if createCommentRequest.ParentCommentID != nil {
		authorId, err = api.commentRepo.FetchCommentAuthorId(*createCommentRequest.ParentCommentID)
	} else {
		authorId, err = api.postRepo.FetchAuthorIDByPostID(*createCommentRequest.ParentCommentID)
	}

	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	api.notifRepo.CreateNotification(authorId, int(commentId))

	c.JSON(
		http.StatusOK,
		gin.H{"message": "Add Comment Successful"},
	)
}

func (api API) UpdateComment(c *gin.Context) {
	var updateCommentRequest UpdateCommentRequest
	err := c.ShouldBind(&updateCommentRequest)
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

	codeResponse, err := api.commentRepo.UpdateComment(repository.Comment{
		ID:      updateCommentRequest.CommentID,
		Comment: updateCommentRequest.Comment,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			codeResponse,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{"message": "Update Comment Successful"},
	)
}

func (api *API) DeleteComment(c *gin.Context) {
	commentID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	codeResponse, err := api.commentRepo.DeleteComment(commentID)
	if err != nil {
		c.AbortWithStatusJSON(
			codeResponse,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{"message": "Delete Comment Successful"},
	)
}
