package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rg-km/final-project-engineering-6/helper"
	"github.com/rg-km/final-project-engineering-6/repository"
	"net/http"
	"strconv"
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
	questionnaires, err := api.questionnaireRepo.ReadAllQuestionnaires()
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
