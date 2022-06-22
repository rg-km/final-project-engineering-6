package api

import (
	"github.com/gin-gonic/gin"
	"github.com/rg-km/final-project-engineering-6/repository"
	"net/http"
	"strconv"
)

func (api API) CreatePostLike(c *gin.Context) {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	userID, err := api.getUserIdFromToken(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isExist, err := api.likeRepo.CheckPostLikeIsExist(repository.PostLike{
		PostID: postID,
		UserID: userID,
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
		PostID: postID,
		UserID: userID,
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
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	userID, err := api.getUserIdFromToken(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isExist, err := api.likeRepo.CheckPostLikeIsExist(repository.PostLike{
		PostID: postID,
		UserID: userID,
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
		PostID: postID,
		UserID: userID,
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
	commentID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	userID, err := api.getUserIdFromToken(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isExist, err := api.likeRepo.CheckCommentLikeIsExist(repository.CommentLike{
		CommentID: commentID,
		UserID:    userID,
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
		CommentID: commentID,
		UserID:    userID,
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
	commentID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	userID, err := api.getUserIdFromToken(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isExist, err := api.likeRepo.CheckCommentLikeIsExist(repository.CommentLike{
		CommentID: commentID,
		UserID:    userID,
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
			gin.H{"error": "No data with given id"},
		)
		return
	}

	err = api.likeRepo.DeleteCommentLike(repository.CommentLike{
		CommentID: commentID,
		UserID:    userID,
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
