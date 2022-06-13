package api

import (
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rg-km/final-project-engineering-6/repository"
)

const (
	Local_Post_Image_Path      = "localhost:8080/media/post/"
	Production_Post_Image_Path = "https://basis.herokuapp.com/media/post/"
)

type CreatePostRequest struct {
	AuthorID    int    `json:"author_id"`
	CategoryID  int    `json:"category_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type UpdatePostRequest struct {
	ID          int    `json:"id"`
	AuthorID    int    `json:"author_id"`
	CategoryID  int    `json:"category_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type DeletePostRequest struct {
	ID       int `json:"id"`
	AuthorID int `json:"author_id"`
}

type CreatePostResponse struct {
	ID int64 `json:"id"`
	SuccessPostResponse
}

type DetailPostResponse struct {
	PostResponse
	Images []PostImageResponse `json:"images"`
}

type PostResponse struct {
	ID           int                `json:"id"`
	Author       AuthorPostResponse `json:"author"`
	CategoryID   int                `json:"category_id"`
	Title        string             `json:"title"`
	Description  string             `json:"description"`
	CreatedAt    string             `json:"created_at"`
	CommentCount int                `json:"comment_count"`
	LikeCount    int                `json:"like_count"`
}

type AuthorPostResponse struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	Role         string `json:"role"`
	Institute    string `json:"institute"`
	Major        string `json:"major"`
	ProfileImage string `json:"profile_image"`
}

type PostImageResponse struct {
	ID  int    `json:"id"`
	URL string `json:"url"`
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

	postID, err := api.postRepo.InsertPost(req.AuthorID, req.CategoryID, req.Title, req.Description)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, CreatePostResponse{
		ID: postID,
		SuccessPostResponse: SuccessPostResponse{
			Message: "Post Created",
		},
	})
}

func (api *API) uploadPostImages(ctx *gin.Context) {
	var (
		postID int
		err    error
	)

	if postID, err = strconv.Atoi(ctx.Param("id")); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Post ID"})
		return
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: err.Error()})
		return
	}

	dir, err := os.Getwd()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: err.Error()})
		return
	}

	files := form.File["images"]
	var wg sync.WaitGroup
	var mu sync.Mutex
	for _, file := range files {
		wg.Add(1)

		go func(file *multipart.FileHeader) {
			defer wg.Done()

			defer func() {
				if v := recover(); v != nil {
					log.Println(v)
					ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
					return
				}
			}()

			uploadedFile, err := file.Open()
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: err.Error()})
				return
			}

			defer uploadedFile.Close()

			unixTime := time.Now().UTC().UnixNano()
			fileName := fmt.Sprintf("%d-%d-%s", postID, unixTime, strings.ReplaceAll(file.Filename, " ", ""))
			fileLocation := filepath.Join(dir, "media/post", fileName)
			targetFile, err := os.OpenFile(fileLocation, os.O_WRONLY|os.O_CREATE, 0666)

			if err != nil {
				ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: err.Error()})
				return
			}

			defer targetFile.Close()

			if _, err := io.Copy(targetFile, uploadedFile); err != nil {
				ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: err.Error()})
				return
			}

			filePath := Local_Post_Image_Path + fileName
			mu.Lock()
			if err := api.postRepo.InsertPostImage(postID, filePath); err != nil {
				ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: err.Error()})
				return
			}
			mu.Unlock()
		}(file)
	}

	wg.Wait()

	ctx.JSON(http.StatusOK, SuccessPostResponse{Message: "Post Images Uploaded"})
}

func (api *API) readPosts(ctx *gin.Context) {
	offset, err := strconv.Atoi(ctx.DefaultQuery("offset", "0"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Offset"})
		return
	}

	limit, err := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Limit"})
		return
	}

	sortBy := ctx.DefaultQuery("sort_by", "newest")
	switch sortBy {
	case "newest":
		sortBy = "created_at DESC"
	case "oldest":
		sortBy = "created_at"
	case "most_liked":
		sortBy = "like_count DESC"
	case "most_commented":
		sortBy = "comment_count DESC"
	default:
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Sort By"})
		return
	}

	var filterQuery1, filterQuery2 string

	searchTitle := ctx.DefaultQuery("search_title", "")
	if searchTitle != "" {
		filterQuery1 = fmt.Sprintf("WHERE title LIKE '%%%s%%'", searchTitle)
	}

	category_id, err := strconv.Atoi(ctx.DefaultQuery("category_id", "0"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Filter By Category ID"})
		return
	}
	if category_id != 0 {
		if filterQuery1 != "" {
			filterQuery1 = fmt.Sprintf("%s AND category_id = %d", filterQuery1, category_id)
		} else {
			filterQuery1 = fmt.Sprintf("WHERE category_id = %d", category_id)
		}
	}

	no_comment, err := strconv.ParseBool(ctx.DefaultQuery("no_comment", "false"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Filter By No Comment Value"})
		return
	}
	if no_comment {
		filterQuery2 = "Having(comment_count) = 0"
	}

	posts, err := api.postRepo.FetchAllPost(limit, offset, sortBy, filterQuery1, filterQuery2)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	if len(posts) == 0 {
		ctx.JSON(http.StatusNotFound, ErrorPostResponse{Message: "Post Not Found"})
		return
	}

	postIDqueue := make([]int, 0)
	postsDetail := make(map[int]PostResponse)

	for _, post := range posts {
		if _, ok := postsDetail[post.ID]; !ok {

			if len(postIDqueue) == 0 || postIDqueue[len(postIDqueue)-1] != post.ID {
				postIDqueue = append(postIDqueue, post.ID)
			}

			var authorMajor, authorInstitute, authorImage string
			if post.AuthorMajor.Valid {
				authorMajor = post.AuthorMajor.String
			}

			if post.AuthorInstitution.Valid {
				authorInstitute = post.AuthorInstitution.String
			}

			if post.AuthorAvatar.Valid {
				authorImage = post.AuthorAvatar.String
			}

			postsDetail[post.ID] = PostResponse{
				ID: post.ID,
				Author: AuthorPostResponse{
					ID:           post.AuthorID,
					Name:         post.AuthorName,
					Role:         post.AuthorRole,
					Major:        authorMajor,
					Institute:    authorInstitute,
					ProfileImage: authorImage,
				},
				CategoryID:   post.CategoryID,
				Title:        post.Title,
				Description:  post.Description,
				CreatedAt:    post.CreatedAt.Format("2006-01-02 15:04:05"),
				CommentCount: post.CommentCount,
				LikeCount:    post.LikeCount,
			}
		}
	}

	images := make(map[int][]PostImageResponse)

	for _, post := range posts {
		if _, ok := images[post.ID]; !ok {
			images[post.ID] = make([]PostImageResponse, 0)
		}

		if post.ImageID.Valid {
			images[post.ID] = append(images[post.ID], PostImageResponse{
				ID:  int(post.ImageID.Int32),
				URL: post.ImagePath.String,
			})
		}
	}

	postsReponse := make([]DetailPostResponse, 0)

	for _, postID := range postIDqueue {
		postsReponse = append(postsReponse, DetailPostResponse{
			PostResponse: postsDetail[postID],
			Images:       images[postID],
		})
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

	posts, err := api.postRepo.FetchPostByID(postID)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	if len(posts) == 0 {
		ctx.JSON(http.StatusNotFound, ErrorPostResponse{Message: "Post Not Found"})
		return
	}

	commentCount, err := api.commentRepo.CountComment(postID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	likeCount, err := api.likeRepo.CountPostLike(postID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	images := make([]PostImageResponse, 0)

	if posts[0].ImageID.Valid {
		for _, post := range posts {
			images = append(images, PostImageResponse{
				ID:  int(post.ImageID.Int32),
				URL: post.ImagePath.String,
			})
		}
	}

	var authorMajor, authorInstitute, authorImage string
	if posts[0].AuthorMajor.Valid {
		authorMajor = posts[0].AuthorMajor.String
	}

	if posts[0].AuthorInstitution.Valid {
		authorInstitute = posts[0].AuthorInstitution.String
	}

	if posts[0].AuthorAvatar.Valid {
		authorImage = posts[0].AuthorAvatar.String
	}

	ctx.JSON(http.StatusOK, DetailPostResponse{
		PostResponse: PostResponse{
			ID: posts[0].ID,
			Author: AuthorPostResponse{
				ID:           posts[0].AuthorID,
				Name:         posts[0].AuthorName,
				Role:         posts[0].AuthorRole,
				Major:        authorMajor,
				Institute:    authorInstitute,
				ProfileImage: authorImage,
			},
			CategoryID:   posts[0].CategoryID,
			Title:        posts[0].Title,
			Description:  posts[0].Description,
			CreatedAt:    posts[0].CreatedAt.Format("2006-01-02 15:04:05"),
			CommentCount: commentCount,
			LikeCount:    likeCount,
		},
		Images: images,
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

	if authorID, err := api.postRepo.FetchAuthorIDByPostID(req.ID); err != nil {
		if errors.Is(err, repository.ErrPostNotFound) {
			ctx.JSON(http.StatusNotFound, ErrorPostResponse{Message: "Post Not Found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	} else if authorID != req.AuthorID {
		ctx.JSON(http.StatusForbidden, ErrorPostResponse{Message: "Forbidden"})
		return
	}

	if err := api.postRepo.UpdatePost(req.ID, req.CategoryID, req.Title, req.Description); err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, SuccessPostResponse{Message: "Post Updated"})

}

func (api *API) deletePost(ctx *gin.Context) {
	var (
		req = DeletePostRequest{}
	)

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorPostResponse{Message: "Invalid Request Body"})
		return
	}

	if authorID, err := api.postRepo.FetchAuthorIDByPostID(req.ID); err != nil {
		if errors.Is(err, repository.ErrPostNotFound) {
			ctx.JSON(http.StatusNotFound, ErrorPostResponse{Message: "Post Not Found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	} else if authorID != req.AuthorID {
		ctx.JSON(http.StatusForbidden, ErrorPostResponse{Message: "Forbidden"})
		return
	}

	if err := api.postRepo.DeletePostByID(req.ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorPostResponse{Message: "Internal Server Error"})
		return
	}

	ctx.JSON(http.StatusOK, SuccessPostResponse{Message: "Post Deleted"})
}
