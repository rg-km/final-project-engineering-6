package seeder

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func Seed(db *sql.DB) {
	// User Mahasiswa
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	rowUserMahasiswa, err := db.Exec("INSERT INTO users (name, email, password, role) VALUES ('Radit', 'resradit@gmail.com', ?, 'mahasiswa')", hashedPassword)
	if err != nil {
		panic(err)
	}

	userMahasiswaId, err := rowUserMahasiswa.LastInsertId()
	if err != nil {
		panic(err)
	}

	db.Exec("INSERT INTO user_details (user_id, institute, major, batch) VALUES (?, 'Harvard', 'Teknik Informatika', 2019)", userMahasiswaId)

	// User Siswa
	rowUserSiswa, err := db.Exec("INSERT INTO users (name, email, password, role) VALUES ('Bocil SMA', 'bocilSMA@gmail.com', ?, 'siswa')", hashedPassword)
	if err != nil {
		panic(err)
	}

	userSiswaId, err := rowUserSiswa.LastInsertId()
	if err != nil {
		panic(err)
	}

	db.Exec("INSERT INTO user_details (user_id, institute) VALUES (?, 'SMA Antah Berantah')", userSiswaId)

	// Kategori
	_, err = db.Exec(`INSERT INTO categories (name) VALUES ('Ekonomi dan Bisnis'),
	('Matematika dan Ilmu Pengetahuan Alam'),
	('Psikologi'),
	('Sosial Politik'),
	('Teknik'),
	('Teknologi')`)

	if err != nil {
		panic(err)
	}

	// Post
	rowPost, err := db.Exec("INSERT INTO posts (author_id, category_id, title, desc, created_at) VALUES (?, 1, 'Post 1', 'Deskripsi Post 1', datetime('now'))", userMahasiswaId)
	if err != nil {
		panic(err)
	}

	postId, err := rowPost.LastInsertId()
	if err != nil {
		panic(err)
	}

	// Komentar
	db.Exec(`INSERT INTO comments(id, post_id, author_id, comment, comment_id, created_at) VALUES 
	(1, $1, $2, "Comment 1", NULL, "2022-06-11 19:33:02.3861157+07:00"),
	(2, $1, $2, "Comment 2", 1, "2022-06-11 19:33:02.3861157+07:00"),
	(3, $1, $2, "Comment 3", 1, "2022-06-11 19:33:02.3861157+07:00"),
	(4, $1, $2, "Comment 4", NULL, "2022-06-11 19:33:02.3861157+07:00"),
	(5, $1, $2, "Comment 5", 4, "2022-06-11 19:33:02.3861157+07:00"),
	(6, $1, $2, "Comment 6", 4, "2022-06-11 19:33:02.3861157+07:00"),
	(7, $1, $2, "Comment 7", 6, "2022-06-11 19:33:02.3861157+07:00");`, postId, userMahasiswaId)

}
