package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (api API) GetAllCategories(c *gin.Context) {
	categories, err := api.categoryRepo.GetAllCategories()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}
