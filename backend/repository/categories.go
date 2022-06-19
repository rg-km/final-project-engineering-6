package repository

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{
		db: db,
	}
}

func (c CategoryRepository) GetAllCategories() ([]Category, error) {
	categories := make([]Category, 0)
	rows, err := c.db.Query("SELECT * FROM categories")
	if err != nil {
		return categories, err
	}
	defer rows.Close()

	for rows.Next() {
		category := Category{}
		rows.Scan(&category.ID, &category.Name)
		categories = append(categories, category)
	}

	return categories, nil
}
