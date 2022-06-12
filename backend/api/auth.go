package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

type LoginReqBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterReqBody struct {
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Password  string  `json:"password"`
	Role      string  `json:"role"`
	Institute string  `json:"institute"`
	Major     *string `json:"major"`
	Semester  *int    `json:"semester"`
}

type LoginSuccessResponse struct {
	Token string `json:"token"`
}

var jwtKey = []byte("key")

type Claims struct {
	Email string
	Role  string
	jwt.StandardClaims
}

func (api *API) register(c *gin.Context) {
	var input RegisterReqBody
	err := c.BindJSON(&input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	responseCode, err := api.userRepo.InsertNewUser(input.Name, input.Email, input.Password, input.Role, input.Institute, input.Major, input.Semester)
	if err != nil {
		c.JSON(responseCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (api *API) login(c *gin.Context) {
	var loginReq LoginReqBody
	err := c.BindJSON(&loginReq)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	email, err := api.userRepo.Login(loginReq.Email, loginReq.Password)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	role, err := api.userRepo.GetUserRole(*email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	expTime := time.Now().Add(60 * time.Minute)

	claims := &Claims{
		Email: *email,
		Role:  *role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, LoginSuccessResponse{Token: tokenString})
}

func ValidateToken(tokenString string) (*jwt.Token, error) {
	claim := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claim, func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	return token, err
}
