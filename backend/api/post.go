package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreatePostRequest struct {
	AuthorID    int    `json:"author_id"`
	CategoryID  int    `json:"category_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type CreatePostReponse struct {
	Message string `json:"message"`
}

func (api *API) createPost(ctx *gin.Context) {
	var (
		req = CreatePostRequest{}
	)

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, CreatePostReponse{Message: "Invalid Request Body"})
		return
	}

	if err := api.postRepo.InsertPost(req.AuthorID, req.CategoryID, req.Title, req.Description); err != nil {
		ctx.JSON(http.StatusInternalServerError, CreatePostReponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, CreatePostReponse{Message: "Post Created"})
}

func (api *API) readPosts(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Get All Post",
	})
}

func (api *API) readPost(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Get Post",
	})
}

func (api *API) updatePost(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Update Post",
	})
}

func (api *API) deletePost(ctx *gin.Context) {}
