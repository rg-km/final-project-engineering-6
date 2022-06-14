package repository_test

import (
	"database/sql"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/rg-km/final-project-engineering-6/db/migration"
	"github.com/rg-km/final-project-engineering-6/repository"
)

var _ = Describe("Login Register Test", func() {
	var userRepo *repository.UserRepository

	BeforeEach(func() {
		db, err := sql.Open("sqlite3", "basis-app.db")
		if err != nil {
			panic(err)
		}

		userRepo = repository.NewUserRepository(db)

		migration.Migrate(db)
	})

	AfterEach(func() {
		db, err := sql.Open("sqlite3", "basis-app.db")
		if err != nil {
			panic(err)
		}

		db.Exec(`DROP TABLE notifications;
		DROP TABLE comment_likes;
		DROP TABLE comments;
		DROP TABLE post_likes;
		DROP TABLE questionnaires;
		DROP TABLE post_images;
		DROP TABLE posts;
		DROP TABLE categories;
		DROP TABLE user_details;
		DROP TABLE users;`)
	})

	Describe("Login", func() {
		When("email and password are correct", func() {
			{
				It("should return user id", func() {
					userId, err := userRepo.Login("resradit@gmail.com", "password")
					Expect(err).ToNot(HaveOccurred())
					Expect(*userId).To(Equal(1))
				})
			}
		})
		When("email is correct but password is incorrect", func() {
			It("should return Login Failed error", func() {
				_, err := userRepo.Login("resradit@gmail.com", "pass")
				Expect(err).To(HaveOccurred())
				Expect(err.Error()).To(Equal("Login Failed"))
			})
		})
		When("email and password are incorrect", func() {
			It("should return Login Failed error", func() {
				_, err := userRepo.Login("resr@gmail.com", "pass")
				Expect(err).To(HaveOccurred())
				Expect(err.Error()).To(Equal("Login Failed"))
			})
		})
	})

	Describe("Register", func() {
		When("All data is complete", func() {
			When("User's role is 'mahasiswa' or 'siswa'", func() {
				When("Email is correct and isn't registered yet", func() {
					When("User role is 'mahasiswa'", func() {
						It("should return user id", func() {

							major := "Informatika"
							semester := 6

							userId, _, err := userRepo.InsertNewUser("user 1", "user1@gmail.com", "password", "mahasiswa", "institute 1", &major, &semester)

							Expect(err).ToNot(HaveOccurred())
							Expect(userId).ToNot(Equal(nil))
						})
					})

					When("User role is 'siswa'", func() {
						It("should return user id", func() {

							userId, _, err := userRepo.InsertNewUser("user 2", "user2@gmail.com", "password", "siswa", "institute 1", nil, nil)

							Expect(err).ToNot(HaveOccurred())
							Expect(userId).ToNot(Equal(nil))

						})
					})
				})

				When("Email is already registered", func() {
					It("should return error", func() {
						major := "Informatika"
						semester := 6
						_, _, err := userRepo.InsertNewUser("user 1", "user1@gmail.com", "password", "mahasiswa", "institute 1", &major, &semester)
						Expect(err).ToNot(HaveOccurred())

						_, _, err = userRepo.InsertNewUser("user 2", "user1@gmail.com", "password", "mahasiswa", "institute 1", &major, &semester)
						Expect(err).To(HaveOccurred())
						Expect(err.Error()).To(Equal("email has been used"))
					})

				})
				When("Email is invalid", func() {
					It("should return error", func() {
						_, _, err := userRepo.InsertNewUser("user 1", "user1", "password", "siswa", "institute 1", nil, nil)
						Expect(err).To(HaveOccurred())
						Expect(err.Error()).To(Equal("invalid email"))
					})

				})
			})

			When("User's role is'nt 'mahasiswa' or 'siswa'", func() {
				It("should return error", func() {
					_, _, err := userRepo.InsertNewUser("user 2", "user2@gmail.com", "password", "admin", "institute 1", nil, nil)
					Expect(err).To(HaveOccurred())
					Expect(err.Error()).To(Equal("role must be either 'mahasiswa' or 'siswa'"))
				})
			})
		})

		When("Some data are incomplete", func() {
			It("Should return error", func() {
				_, _, err := userRepo.InsertNewUser("user 1", "user1@gmail.com", "password", "mahasiswa", "institute 1", nil, nil)
				Expect(err).To(HaveOccurred())
			})
		})
	})
})
