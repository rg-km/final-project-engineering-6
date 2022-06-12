package repository

import (
	"database/sql"
	"errors"
	"net/http"
	"regexp"
	"strings"

	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (u *UserRepository) Login(email string, password string) (*string, error) {
	statement := "SELECT password FROM users WHERE email = ?"
	res := u.db.QueryRow(statement, email, password)
	var hashedPassword string
	res.Scan(&hashedPassword)
	if bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)) != nil {
		return nil, errors.New("Login Failed")
	}
	return &email, nil
}

func (u *UserRepository) GetUserRole(email string) (*string, error) {
	statement := "SELECT role FROM users WHERE email = ?"
	var role string
	res := u.db.QueryRow(statement, email)
	err := res.Scan(&role)
	return &role, err
}

func (u *UserRepository) CheckEmail(email string) (bool, error) {
	statement := "SELECT count(*) FROM users WHERE email = ?"
	res := u.db.QueryRow(statement, email)

	var count int
	err := res.Scan(&count)
	if count > 0 {
		return false, err
	}
	return true, err
}

func (u *UserRepository) InsertNewUser(name string, email string, password string, role string, institute string, major *string, semester *int) (int, error) {
	if strings.ToLower(role) != "mahasiswa" && strings.ToLower(role) != "siswa" {
		return http.StatusBadRequest, errors.New("role must be either 'mahasiswa' or 'siswa'")
	}

	isAvailable, err := u.CheckEmail(email)
	if err != nil {
		return http.StatusBadRequest, err
	}

	if !isAvailable {
		return http.StatusBadRequest, errors.New("email has been used")
	}
	regex, err := regexp.Compile("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
	if err != nil {
		return http.StatusInternalServerError, err
	}

	isValid := regex.Match([]byte(email))
	if !isValid {
		return http.StatusBadRequest, errors.New("invalid email")
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	statement := "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
	res, err := u.db.Exec(statement, name, email, hashedPassword, strings.ToLower(role))
	if err != nil {
		return http.StatusInternalServerError, err
	}
	resId, err := res.LastInsertId()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	statement = "INSERT INTO user_details (user_id, institute, major, semester) VALUES (?, ?, ?, ?)"
	_, err = u.db.Exec(statement, resId, institute, major, semester)

	return http.StatusOK, err
}
