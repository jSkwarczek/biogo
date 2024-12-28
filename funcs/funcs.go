package funcs

import (
	"biogo/structs"
	"bytes"
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/dgraph-io/badger/v4"
	"github.com/pquerna/otp/totp"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
	"io"
	"log"
	"net/http"
	"os"
)

type ApiInfo struct {
	FromAddress  string `json:"from_address"`
	GoogleAppKey string `json:"google_app_key"`
}

func getApiInfo() ApiInfo {
	var apiInfo ApiInfo
	jsonFile, err := os.Open("settings/private.json")

	if err != nil {
		log.Fatalf("Cannot open file %s!\n", "'private.json'")
	}

	byteVal, _ := io.ReadAll(jsonFile)
	err = json.Unmarshal(byteVal, &apiInfo)

	if err != nil {
		log.Fatalf("Cannot parse file %s!\n", "'private.json'")
	}

	return apiInfo
}

func SendEmail(address string, code string) error {
	apiInfo := getApiInfo()

	msg := gomail.NewMessage()
	msg.SetHeader("From", apiInfo.FromAddress)
	msg.SetHeader("To", address)
	msg.SetHeader("Subject", "Your MFA code.")
	msg.SetBody("text/html", code)

	n := gomail.NewDialer("smtp.gmail.com", 587, apiInfo.FromAddress, apiInfo.GoogleAppKey)

	if err := n.DialAndSend(msg); err != nil {
		return err
	}

	return nil
}

func GenerateCode() string {
	table := [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
	b := make([]byte, 6)
	n, err := io.ReadAtLeast(rand.Reader, b, 6)
	if n != 6 {
		panic(err)
	}
	for i := 0; i < len(b); i++ {
		b[i] = table[int(b[i])%len(table)]
	}
	return string(b)
}

func GenerateSecret(username string) (string, string) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "biogo",
		AccountName: username,
	})

	if err != nil {
		log.Fatal(err)
	}

	return key.Secret(), key.URL()
}

func GenerateHash(password string) string {
	pwd := []byte(password)
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}

func CheckHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

type User struct {
	Username string
	UserD    UserDetails
}

type UserDetails struct {
	PasswordHash string `json:"PasswordHash"`
	Email        string `json:"Email"`
	Email2fa     bool   `json:"Email2fa"`
	OtpSecret    string `json:"OtpSecret"`
	EnableTotp   bool   `json:"EnableTotp"`
}

func (userD UserDetails) getUserDetailsString() string {
	return fmt.Sprintf("\tHash: %s\n\tEmail: %s\n\tEmail 2FA enable: %t\n\tOTP secret: %s\n\tTOTP enable: %t\n", userD.PasswordHash, userD.Email, userD.Email2fa, userD.OtpSecret, userD.EnableTotp)
}

type DB struct {
	Db *badger.DB
}

func OpenDb(path string) (*DB, error) {
	opts := badger.DefaultOptions(path)

	opts.Logger = nil
	badgerInstance, err := badger.Open(opts)
	if err != nil {
		return nil, fmt.Errorf("opening kv: %w", err)
	}

	return &DB{badgerInstance}, nil
}

func (db *DB) UserExists(username string) (bool, error) {
	var exists bool
	err := db.Db.View(
		func(tx *badger.Txn) error {
			if val, err := tx.Get([]byte(username)); err != nil {
				return err
			} else if val != nil {
				exists = true
			}
			return nil
		})
	if errors.Is(err, badger.ErrKeyNotFound) {
		err = nil
	}
	return exists, err
}

func (db *DB) GetUserData(username string) (User, error) {
	var userD UserDetails
	err := db.Db.View(
		func(txn *badger.Txn) error {
			userItem, err := txn.Get([]byte(username))
			if err != nil {
				return err
			}

			var val []byte
			val, err = userItem.ValueCopy(nil)
			if err != nil {
				return err
			}

			err = json.Unmarshal(val, &userD)
			if err != nil {
				return err
			}
			return nil
		})
	return User{username, userD}, err
}

func (db *DB) AddUser(user User) error {
	err := db.Db.Update(func(txn *badger.Txn) error {
		userDetailsBytes, err := json.Marshal(user.UserD)
		if err != nil {
			log.Fatal(err)
			return err
		}
		return txn.Set([]byte(user.Username), userDetailsBytes)
	})

	return err
}

func (db *DB) Register(username, password, email, otpSecret string, email2fa, enableTotp bool) error {
	if userExists, err := db.UserExists(username); userExists || err != nil {
		return errors.New("user already exists")
	}

	hash := GenerateHash(password)

	newUserDetails := UserDetails{hash, email, email2fa, otpSecret, enableTotp}
	newUser := User{username, newUserDetails}

	err := db.AddUser(newUser)
	if err != nil {
		return err
	}

	return nil
}

func (db *DB) Login(username, password string) bool {
	if userExists, err := db.UserExists(username); !userExists || err != nil {
		return false
	}

	user, err := db.GetUserData(username)
	if err != nil {
		return false
	}

	return CheckHash(password, user.UserD.PasswordHash)
}

func (db *DB) DeleteUser(username string) error {
	err := db.Db.Update(func(txn *badger.Txn) error {
		return txn.Delete([]byte(username))
	})

	return err
}

func (db *DB) PrintDb() error {
	err := db.Db.View(func(txn *badger.Txn) error {
		opts := badger.DefaultIteratorOptions
		it := txn.NewIterator(opts)
		defer it.Close()
		for it.Rewind(); it.Valid(); it.Next() {
			item := it.Item()
			username := item.Key()
			var val []byte
			var userD UserDetails

			val, err := item.ValueCopy(nil)
			if err != nil {
				return err
			}

			err = json.Unmarshal(val, &userD)
			if err != nil {
				return err
			}

			fmt.Printf("User: %s\nUser details:\n%s\n", username, userD.getUserDetailsString())
		}
		return nil
	})

	return err
}

func EncodeError(w http.ResponseWriter, errorMsg string) {
	response := structs.BasicResponse{Status: "error", Message: errorMsg}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Total failure.", http.StatusInternalServerError)
	}
	return
}

func SendRequestToModel(data any, addr string) (bool, error) {
	byteData, err := json.Marshal(data)
	if err != nil {
		return false, errors.New("Cannot marshal JSON for model request.")
	}

	resp, err := http.Post(
		addr,
		"application/json",
		bytes.NewBuffer(byteData))

	if err != nil {
		return false, errors.New("Cannot send model request.")
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, errors.New("Cannot read model response.")
	}

	var modelResponse structs.ModelResponse
	err = json.Unmarshal(body, &modelResponse)
	if err != nil {
		return false, errors.New("Cannot unmarchal model response.")
	}

	if modelResponse.Status != "success" {
		return false, nil
	}

	return true, nil
}

// func CheckAndEncodeError(w http.ResponseWriter, e error, errorMsg string) {
// 	if e != nil {
// 		EncodeError(w, errorMsg)
// 	}
// }
