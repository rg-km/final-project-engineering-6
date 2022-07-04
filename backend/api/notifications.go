package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ReadNotifRequest struct {
	NotifId *int `json:"notif_id" form:"notif_id"`
}

func (api API) GetAllNotifications(c *gin.Context) {
	userId, err := api.getUserIdFromToken(c)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	notifs, err := api.notifRepo.GetAllNotifications(userId, page, limit)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notifs)
}

func (api API) SetReadNotif(c *gin.Context) {
	var reqBody ReadNotifRequest

	err := c.Bind(&reqBody)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	userId, err := api.getUserIdFromToken(c)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if reqBody.NotifId == nil {
		err = api.notifRepo.SetReadAllNotification(userId)
	} else {
		err = api.notifRepo.SetReadNotification(userId, *reqBody.NotifId)
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
