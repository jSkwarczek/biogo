package funcs

import (
	"crypto/rand"
	"encoding/json"
	"github.com/pquerna/otp/totp"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
	"io"
	"log"
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
	Username     string
	PasswordHash string
	Email        string
	Email2fa     bool
	OtpSecret    string
	EnableTotp   bool
}

type UserData struct {
	Users []User
}

func (ud *UserData) UsernameExists(username string) int {
	for idx, u := range ud.Users {
		if u.Username == username {
			return idx
		}
	}
	return -1
}

func (ud *UserData) Register(username, password, email, otpSecret string, email2fa, enableTotp bool) bool {
	if ud.UsernameExists(username) != -1 {
		return false
	}

	hash := GenerateHash(password)

	newUser := User{username, hash, email, email2fa, otpSecret, enableTotp}
	ud.Users = append(ud.Users, newUser)
	return true
}

func (ud *UserData) Login(username, password string) bool {
	userIndex := ud.UsernameExists(username)
	if userIndex == -1 {
		return false
	}
	return CheckHash(password, ud.Users[userIndex].PasswordHash)
}

type userJson struct {
	Username     string `json:"Username"`
	PasswordHash string `json:"PasswordHash"`
	EmailJ       string `json:"Email"`
	Email2fa     bool   `json:"Email2fa"`
	OtpSecret    string `json:"OtpSecret"`
	EnableTotp   bool   `json:"EnableTotp"`
}

func OpenDbXd() *UserData {
	var dbList []userJson
	jsonFile, err := os.Open("betterUsersDatabase.json")

	if err != nil {
		log.Fatalf("Cannot open file %s!\n", "'betterUsersDatabase.json'")
	}

	byteVal, _ := io.ReadAll(jsonFile)
	err = json.Unmarshal(byteVal, &dbList)

	if err != nil {
		log.Fatalf("Cannot parse file %s!\n", "'betterUsersDatabase.json'")
	}

	var db []User
	for _, u := range dbList {
		db = append(db, User{u.Username, u.PasswordHash, u.EmailJ, u.Email2fa, u.OtpSecret, u.EnableTotp})
	}

	ud := UserData{db}
	return &ud
}

func WriteDbXd(db *UserData, filename string) {
	b, err := json.Marshal(db.Users)
	if err != nil {
		panic(err)
	}

	jsonFile, err := os.Create(filename)

	if err != nil {
		log.Fatalf("Cannot create file %s!\n", filename)
	}

	_, err = jsonFile.Write(b)
	if err != nil {
		panic(err)
	}
}
