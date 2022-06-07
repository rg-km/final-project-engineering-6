package api

import (
	"encoding/json"
	"net/http"
)

type AuthErrorResponse struct {
	Error string `json:"error"`
}

func (api *API) AllowOrigin(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	if req.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
	}
}

func (api *API) GET(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		api.AllowOrigin(w, r)
		encoder := json.NewEncoder(w)
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			encoder.Encode(AuthErrorResponse{Error: "Need GET Method!"})
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (api *API) POST(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		api.AllowOrigin(w, r)
		encoder := json.NewEncoder(w)
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			encoder.Encode(AuthErrorResponse{Error: "Need POST Method!"})
			return
		}

		next.ServeHTTP(w, r)
	})
}
