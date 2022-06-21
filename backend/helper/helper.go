package helper

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

type JSONRequestErrorResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func GetErrorMessage(ve validator.ValidationErrors) []JSONRequestErrorResponse {
	out := make([]JSONRequestErrorResponse, len(ve))
	for i, fe := range ve {
		var message string
		switch fe.Tag() {
		case "required":
			message = "This field is required"
		case "number":
			message = "Should be a number"
		case "lowercase":
			message = "Value must be lowercase"
		case "required_if":
			params := strings.Split(fe.Param(), " ")
			i := 0

			requiredMessage := ""
			for i < len(params) {
				if i != 0 {
					requiredMessage += ", "
				}
				requiredMessage += fmt.Sprintf("%s is %s", strings.ToLower(params[i]), params[i+1])
				i += 2
			}
			message = fmt.Sprintf("This field is required if %s", requiredMessage)
		case "oneof":
			message = fmt.Sprintf("Value must be one of %s", strings.Replace(fe.Param(), " ", ", ", -1))
		case "url":
			message = "Should be an url"
		default:
			message = "Unknown error"
		}
		out[i] = JSONRequestErrorResponse{fe.Field(), message}
	}

	return out
}
