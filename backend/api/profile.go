package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type UpdateUserRequest struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
}

type UserResponse struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	Avatar    string `json:"avatar"`
	Institute string `json:"institute"`
	Major     string `json:"major"`
	Batch     int    `json:"batch"`
}

type Response struct {
	Message string `json:"message"`
}

func (api *API) getProfile(ctx *gin.Context) {
	userID, err := api.getUserIdFromToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, Response{"Unauthorized"})
		return
	}

	user, err := api.userRepo.GetUserData(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, Response{Message: "Internal Server Error"})
		return
	}

	var (
		userAvatar, userMajor string
		userBatch             int
	)

	if user.Avatar != nil {
		userAvatar = *user.Avatar
	}

	if user.Major != nil {
		userMajor = *user.Major
	}

	if user.Batch != nil {
		userBatch = *user.Batch
	}

	ctx.JSON(http.StatusOK, UserResponse{
		ID:        user.Id,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		Avatar:    userAvatar,
		Institute: user.Institute,
		Major:     userMajor,
		Batch:     userBatch,
	})
}

func (api *API) updateProfile(ctx *gin.Context) {
	var request UpdateUserRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, Response{Message: "Invalid Request"})
		return
	}

	userID, err := api.getUserIdFromToken(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, Response{"Unauthorized"})
		return
	}

	if err := api.userRepo.UpdateUserData(userID, request.Name, request.Email); err != nil {
		ctx.JSON(http.StatusInternalServerError, Response{Message: err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, Response{Message: "Successfully Updated"})
}
