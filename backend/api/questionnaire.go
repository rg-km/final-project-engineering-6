package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rg-km/final-project-engineering-6/helper"
	"github.com/rg-km/final-project-engineering-6/repository"
	"github.com/rg-km/final-project-engineering-6/service"
)

type CreateQuestionnaireRequest struct {
	AuthorID    int    `json:"author_id" binding:"required"`
	CategoryID  int    `json:"category_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Link        string `json:"link" binding:"required,url"`
	Reward      string `json:"reward"`
}

type UpdateQuestionnaireRequest struct {
	ID          int    `json:"id" binding:"required"`
	CategoryID  int    `json:"category_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Link        string `json:"link" binding:"required,url"`
	Reward      string `json:"reward"`
}

func (api *API) ReadAllQuestionnaires(c *gin.Context) {
	sortBy := c.DefaultQuery("sort_by", "newest")
	switch sortBy {
	case "newest":
		sortBy = "created_at DESC"
	case "oldest":
		sortBy = "created_at"
	case "most_liked":
		sortBy = "total_like DESC"
	case "most_commented":
		sortBy = "total_comment DESC"
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Sort By"})
		return
	}

	var filterQuery string

	searchTitle := c.DefaultQuery("search_title", "")
	filterQuery = fmt.Sprintf("title LIKE '%%%s%%'", searchTitle)

	categoryId, err := strconv.Atoi(c.DefaultQuery("category_id", "0"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Filter By Category ID"})
		return
	}
	if categoryId != 0 {
		filterQuery = fmt.Sprintf("%s AND category_id = %d", filterQuery, categoryId)
	}

	me, err := strconv.ParseBool(c.DefaultQuery("me", "false"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Filter By Me"})
		return
	}

	if me {
		userID, err := api.getUserIdFromToken(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		filterQuery = fmt.Sprintf("%s AND author_id = %d", filterQuery, userID)
	}

	questionnaires, err := api.questionnaireRepo.ReadAllQuestionnaires(filterQuery, sortBy)
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		questionnaires,
	)
}

func (api *API) ReadAllQuestionnaireByID(c *gin.Context) {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": "id should be a int"},
		)
		return
	}

	isExist, err := api.questionnaireRepo.CheckQuestionnaireExist(postID)
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

	questionnaire, err := api.questionnaireRepo.ReadAllQuestionnaireByID(postID)
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		questionnaire,
	)
}

func (api *API) CreateQuestionnaire(c *gin.Context) {
	var createQuestionnaireRequest CreateQuestionnaireRequest
	err := c.ShouldBind(&createQuestionnaireRequest)
	if err != nil {
		var ve validator.ValidationErrors
		var jsonErr *json.UnmarshalTypeError
		if errors.As(err, &ve) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"errors": helper.GetErrorMessage(ve)},
			)
		} else if errors.As(err, &jsonErr) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": fmt.Sprintf("%s should be a %s", jsonErr.Field, jsonErr.Type)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
		}
		return
	}

	isTitleOK := service.GetValidationInstance().Validate(createQuestionnaireRequest.Title)
	isDescriptionOK := service.GetValidationInstance().Validate(createQuestionnaireRequest.Description)
	if !isTitleOK || !isDescriptionOK {
		c.AbortWithStatusJSON(http.StatusBadRequest, ErrorPostResponse{Message: "Your post contains bad words"})
		return
	}

	err = api.questionnaireRepo.InsertQuestionnaire(repository.Questionnaire{
		Author: repository.User{
			Id: createQuestionnaireRequest.AuthorID,
		},
		Category: repository.Category{
			ID: createQuestionnaireRequest.CategoryID,
		},
		Title:       createQuestionnaireRequest.Title,
		Description: createQuestionnaireRequest.Description,
		Link:        createQuestionnaireRequest.Link,
		Reward:      createQuestionnaireRequest.Reward,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{"message": "Add Questionnaire Successful"},
	)
}

func (api *API) UpdateQuestionnaire(c *gin.Context) {
	var updateQuestionnaireRequest UpdateQuestionnaireRequest
	err := c.ShouldBind(&updateQuestionnaireRequest)
	if err != nil {
		var ve validator.ValidationErrors
		var jsonErr *json.UnmarshalTypeError
		if errors.As(err, &ve) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"errors": helper.GetErrorMessage(ve)},
			)
		} else if errors.As(err, &jsonErr) {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": fmt.Sprintf("%s should be a %s", jsonErr.Field, jsonErr.Type)},
			)
		} else {
			c.AbortWithStatusJSON(
				http.StatusBadRequest,
				gin.H{"error": err.Error()},
			)
		}
		return
	}

	isExist, err := api.questionnaireRepo.CheckQuestionnaireExist(updateQuestionnaireRequest.ID)
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

	isTitleOK := service.GetValidationInstance().Validate(updateQuestionnaireRequest.Title)
	isDescriptionOK := service.GetValidationInstance().Validate(updateQuestionnaireRequest.Description)
	if !isTitleOK || !isDescriptionOK {
		c.AbortWithStatusJSON(http.StatusBadRequest, ErrorPostResponse{Message: "Your post contains bad words"})
		return
	}

	err = api.questionnaireRepo.UpdateQuestionnaire(repository.Questionnaire{
		ID: updateQuestionnaireRequest.ID,
		Category: repository.Category{
			ID: updateQuestionnaireRequest.CategoryID,
		},
		Title:       updateQuestionnaireRequest.Title,
		Description: updateQuestionnaireRequest.Description,
		Link:        updateQuestionnaireRequest.Link,
		Reward:      updateQuestionnaireRequest.Reward,
	})
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{"message": "Update Questionnaire Successful"},
	)
}

func (api *API) DeleteQuestionnaire(c *gin.Context) {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{"error": "id should be a int"},
		)
		return
	}

	isExist, err := api.questionnaireRepo.CheckQuestionnaireExist(postID)
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

	err = api.questionnaireRepo.DeleteQuestionnaire(postID)
	if err != nil {
		c.AbortWithStatusJSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{"message": "Delete Questionnaire Successful"},
	)
}
