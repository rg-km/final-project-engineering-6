package helper

import "github.com/go-playground/validator/v10"

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
		default:
			message = "Unknown error"
		}
		out[i] = JSONRequestErrorResponse{fe.Field(), message}
	}

	return out
}
