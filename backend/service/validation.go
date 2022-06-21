package service

import (
	"encoding/csv"
	"io"
	"log"
	"os"
	"regexp"
	"strings"
	"sync"
)

// Singleton Design Pattern

var mu = &sync.Mutex{}

type validation struct {
	badwords map[string]struct{}
}

var validationInstance *validation

func GetValidationInstance() *validation {
	if validationInstance == nil {
		mu.Lock()
		defer mu.Unlock()
		if validationInstance == nil {
			badwords := loadCSV()
			validationInstance = &validation{
				badwords: badwords,
			}
		}
	}
	return validationInstance
}

func (v *validation) Validate(sentence string) bool {
	reg, err := regexp.Compile("[^a-zA-Z0-9]+")
	if err != nil {
		log.Println(err)
	}

	sentence = reg.ReplaceAllString(sentence, " ")

	words := strings.Split(sentence, " ")
	for _, word := range words {
		if _, ok := v.badwords[strings.ToLower(word)]; ok {
			return false
		}
	}
	return true
}

func loadCSV() map[string]struct{} {
	badwords := make(map[string]struct{})
	file, err := os.Open("badwords.csv")
	if err != nil {
		panic(err)
	}

	defer file.Close()

	csvReader := csv.NewReader(file)
	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			panic(err)
		}
		badwords[record[0]] = struct{}{}
	}

	return badwords
}
