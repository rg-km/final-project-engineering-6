package api

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rg-km/final-project-engineering-6/repository"
)

type CreatePostRequest struct {
	AuthorID    int    `json:"author_id"`
	CategoryID  int    `json:"category_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type UpdatePostRequest struct {
	ID          int    `json:"id"`
	CategoryID  int    `json:"category_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type DetailPostResponse struct {
	ID          int    `json:"id"`
	AuthorID    int    `json:"author_id"`
	CategoryID  int    `json:"category_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
}

type SuccessPostResponse struct {
	Message string `json:"message"`
}

type ErrorPostResponse struct {
	Message string `json:"error"`
}

func (api *API) createPost(ctx *gin.Context) {
	var (
		req = CreatePostRequest{}
	)

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Request Body"})
		return
	}

	if err := api.postRepo.InsertPost(req.AuthorID, req.CategoryID, req.Title, req.Description); err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, SuccessPostResponse{Message: "Post Created"})
}

func (api *API) readPosts(ctx *gin.Context) {
	posts, err := api.postRepo.FetchAllPost()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	postsReponse := make([]DetailPostResponse, len(posts))

	for i, post := range posts {
		postsReponse[i] = DetailPostResponse{
			ID:          post.ID,
			AuthorID:    post.AuthorID,
			CategoryID:  post.CategoryID,
			Title:       post.Title,
			Description: post.Description,
			CreatedAt:   post.CreatedAt.Format(time.RFC3339),
		}
	}

	ctx.JSON(http.StatusOK, postsReponse)
}

func (api *API) readPost(ctx *gin.Context) {
	var (
		postID int
		err    error
	)

	if postID, err = strconv.Atoi(ctx.Param("id")); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Post ID"})
		return
	}

	post, err := api.postRepo.FetchPostByID(postID)

	if err != nil {
		if errors.Is(err, repository.ErrPostNotFound) {
			ctx.JSON(http.StatusNotFound, ErrorPostResponse{Message: "Post Not Found"})
			return
		}

		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, DetailPostResponse{
		ID:          post.ID,
		AuthorID:    post.AuthorID,
		CategoryID:  post.CategoryID,
		Title:       post.Title,
		Description: post.Description,
		CreatedAt:   post.CreatedAt.Format(time.RFC3339),
	})
}

func (api *API) updatePost(ctx *gin.Context) {
	var (
		req = UpdatePostRequest{}
	)

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Request Body"})
		return
	}

	if err := api.postRepo.UpdatePost(req.ID, req.CategoryID, req.Title, req.Description); err != nil {

		if errors.Is(err, repository.ErrPostNotFound) {
			ctx.JSON(http.StatusNotFound, ErrorPostResponse{Message: "Post Not Found"})
			return
		}

		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, SuccessPostResponse{Message: "Post Updated"})

}

func (api *API) deletePost(ctx *gin.Context) {
	var (
		postID int
		err    error
	)

	if postID, err = strconv.Atoi(ctx.Param("id")); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Post ID"})
		return
	}

	if err := api.postRepo.DeletePostByID(postID); err != nil {

		if errors.Is(err, repository.ErrPostNotFound) {
			ctx.JSON(http.StatusNotFound, ErrorPostResponse{Message: "Post Not Found"})
			return
		}

		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, SuccessPostResponse{Message: "Post Deleted"})
}
