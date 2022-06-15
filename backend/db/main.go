package main

import (
	"database/sql"

	"github.com/rg-km/final-project-engineering-6/db/migration"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "basis-app.db")
	if err != nil {
		panic(err)
	}

	defer db.Close()

	migration.Migrate(db)
}
