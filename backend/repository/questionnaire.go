package repository

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type QuestionnaireRepository struct {
	db *sql.DB
}

func NewQuestionnaireRepository(db *sql.DB) *QuestionnaireRepository {
	return &QuestionnaireRepository{
		db: db,
	}
}

func (q *QuestionnaireRepository) ReadAllQuestionnaires(filter, sortBy string) ([]Questionnaire, error) {
	sqlStmt := fmt.Sprintf(
		`
	SELECT
		p.id,
		u.id,
		u.name,
		u.email,
		u.role,
		u.avatar,
		ud.institute,
		ud.major,
		ud.batch,
		c.*,
		p.title,
		p.desc,
		p.created_at,
		q.link,
		q.reward,
		(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS total_like,
		(SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS total_comment
	FROM posts p
	LEFT JOIN users u ON p.author_id = u.id
	LEFT JOIN user_details ud ON u.id = ud.user_id
	LEFT JOIN categories c ON p.category_id = c.id
	INNER JOIN questionnaires q ON p.id = q.post_id
	WHERE %s
	ORDER BY %s;`,
		filter,
		sortBy)

	rows, err := q.db.Query(sqlStmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	questionnaires := []Questionnaire{}
	for rows.Next() {
		var questionnaire Questionnaire

		err = rows.Scan(
			&questionnaire.ID,
			&questionnaire.Author.Id,
			&questionnaire.Author.Name,
			&questionnaire.Author.Email,
			&questionnaire.Author.Role,
			&questionnaire.Author.Avatar,
			&questionnaire.Author.Institute,
			&questionnaire.Author.Major,
			&questionnaire.Author.Batch,
			&questionnaire.Category.ID,
			&questionnaire.Category.Name,
			&questionnaire.Title,
			&questionnaire.Description,
			&questionnaire.CreatedAt,
			&questionnaire.Link,
			&questionnaire.Reward,
			&questionnaire.TotalLike,
			&questionnaire.TotalComment,
		)
		if err != nil {
			return nil, err
		}

		questionnaires = append(questionnaires, questionnaire)
	}

	return questionnaires, nil
}

func (q *QuestionnaireRepository) ReadAllQuestionnaireByID(postID int) (Questionnaire, error) {
	sqlStmt := `
	SELECT
		p.id,
		u.id,
		u.name,
		u.email,
		u.role,
		u.avatar,
		ud.institute,
		ud.major,
		ud.batch,
		c.*,
		p.title,
		p.desc,
		p.created_at,
		q.link,
		q.reward,
		(SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS total_like,
		(SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS total_comment
	FROM posts p
	LEFT JOIN users u ON p.author_id = u.id
	LEFT JOIN user_details ud ON u.id = ud.user_id
	LEFT JOIN categories c ON p.category_id = c.id
	INNER JOIN questionnaires q ON p.id = q.post_id
	WHERE p.id = ?;`

	row := q.db.QueryRow(sqlStmt, postID)

	var questionnaire Questionnaire
	err := row.Scan(
		&questionnaire.ID,
		&questionnaire.Author.Id,
		&questionnaire.Author.Name,
		&questionnaire.Author.Email,
		&questionnaire.Author.Role,
		&questionnaire.Author.Avatar,
		&questionnaire.Author.Institute,
		&questionnaire.Author.Major,
		&questionnaire.Author.Batch,
		&questionnaire.Category.ID,
		&questionnaire.Category.Name,
		&questionnaire.Title,
		&questionnaire.Description,
		&questionnaire.CreatedAt,
		&questionnaire.Link,
		&questionnaire.Reward,
		&questionnaire.TotalLike,
		&questionnaire.TotalComment,
	)
	if err != nil {
		return Questionnaire{}, err
	}

	return questionnaire, nil
}

func (q QuestionnaireRepository) InsertQuestionnaire(questionnaire Questionnaire) error {
	tx, err := q.db.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	result, err := tx.Exec(
		"INSERT INTO posts (author_id, category_id, title, desc, created_at) VALUES (?, ?, ?, ?, ?);",
		questionnaire.Author.Id,
		questionnaire.Category.ID,
		questionnaire.Title,
		questionnaire.Description,
		time.Now(),
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	_, err = tx.Exec(
		"INSERT INTO questionnaires (post_id, link, reward) VALUES (?, ?, ?);",
		id,
		questionnaire.Link,
		questionnaire.Reward,
	)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (q QuestionnaireRepository) UpdateQuestionnaire(questionnaire Questionnaire) error {
	tx, err := q.db.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(
		"UPDATE posts SET category_id = ?, title = ?, desc = ? WHERE id = ?;",
		questionnaire.Category.ID,
		questionnaire.Title,
		questionnaire.Description,
		questionnaire.ID,
	)
	if err != nil {
		return err
	}

	_, err = tx.Exec(
		"UPDATE questionnaires SET link = ?, reward = ? WHERE post_id = ?;",
		questionnaire.Link,
		questionnaire.Reward,
		questionnaire.ID,
	)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (q QuestionnaireRepository) DeleteQuestionnaire(postID int) error {
	tx, err := q.db.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	_, err = tx.Exec(
		"DELETE FROM posts WHERE id = ?;",
		postID,
	)
	if err != nil {
		return err
	}

	_, err = tx.Exec(
		"DELETE FROM questionnaires WHERE post_id = ?;",
		postID,
	)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (q *QuestionnaireRepository) CheckQuestionnaireExist(postID int) (bool, error) {
	sqlStmt := `
	SELECT  
		COUNT(*)
	FROM posts p
	INNER JOIN questionnaires q ON p.id = q.post_id
	WHERE id = ?;`
	result := q.db.QueryRow(sqlStmt, postID)

	var count int
	err := result.Scan(&count)
	if err != nil {
		return false, err
	}

	if count == 1 {
		return true, nil
	} else {
		return false, nil
	}
}
