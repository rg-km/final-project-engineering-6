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

type User struct {
	Id        int     `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Role      string  `json:"role"`
	Institute string  `json:"institute"`
	Major     string  `json:"major"`
	Semester  int     `json:"semester"`
	Avatar    *string `json:"avatar"`
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (u *UserRepository) Login(email string, password string) (*int, error) {
	statement := "SELECT id, password FROM users WHERE email = ?"
	res := u.db.QueryRow(statement, email, password)
	var hashedPassword string
	var id int
	res.Scan(&id, &hashedPassword)
	if bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)) != nil {
		return nil, errors.New("Login Failed")
	}
	return &id, nil
}

func (u *UserRepository) GetUserData(id int) (*User, error) {
	statement := "SELECT users.id, name, email, role, avatar, institute, major, semester FROM user_details JOIN users ON users.id = user_details.user_id WHERE users.id = ?"
	var user User
	res := u.db.QueryRow(statement, id)
	err := res.Scan(&user.Id, &user.Name, &user.Email, &user.Role, &user.Avatar, &user.Institute, &user.Major, &user.Semester)
	return &user, err
}

func (u *UserRepository) GetUserRole(id int) (*string, error) {
	statement := "SELECT role FROM users WHERE id = ?"
	var role string
	res := u.db.QueryRow(statement, id)
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

func (u *UserRepository) InsertNewUser(name string, email string, password string, role string, institute string, major *string, semester *int) (userId int, responseCode int, err error) {
	if strings.ToLower(role) != "mahasiswa" && strings.ToLower(role) != "siswa" {
		return -1, http.StatusBadRequest, errors.New("role must be either 'mahasiswa' or 'siswa'")
	}

	if strings.ToLower(role) == "mahasiswa" {
		if major == nil || semester == nil {
			return -1, http.StatusBadRequest, errors.New("please fill major and semester correctly")
		}
	}

	isAvailable, err := u.CheckEmail(email)
	if err != nil {
		return -1, http.StatusBadRequest, err
	}

	if !isAvailable {
		return -1, http.StatusBadRequest, errors.New("email has been used")
	}
	regex, err := regexp.Compile("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
	if err != nil {
		return -1, http.StatusInternalServerError, err
	}

	isValid := regex.Match([]byte(email))
	if !isValid {
		return -1, http.StatusBadRequest, errors.New("invalid email")
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	statement := "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
	res, err := u.db.Exec(statement, name, email, hashedPassword, strings.ToLower(role))
	if err != nil {
		return -1, http.StatusInternalServerError, err
	}
	resId, err := res.LastInsertId()
	if err != nil {
		return -1, http.StatusInternalServerError, err
	}

	statement = "INSERT INTO user_details (user_id, institute, major, semester) VALUES (?, ?, ?, ?)"
	_, err = u.db.Exec(statement, resId, institute, major, semester)

	return int(resId), http.StatusOK, err
}

func (u *UserRepository) UpdateAvatar(userId int, filepath string) error {
	statement := "UPDATE users SET avatar = ? WHERE id = ?"
	_, err := u.db.Exec(statement, filepath, userId)
	return err
}
