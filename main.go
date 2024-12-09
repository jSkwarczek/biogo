package main

import (
	"biogo/funcs"
	"biogo/structs"
	"encoding/json"
	"fmt"
	"github.com/gorilla/sessions"
	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
	"log"
	"net/http"
	"time"
)

var db *funcs.DB
var store *sessions.CookieStore

func main() {
	var err error
	db, err = funcs.OpenDb("./db")
	if err != nil {
		log.Fatal(err)
		return
	}

	//err = db.PrintDb()
	//if err != nil {
	//	log.Fatal(err)
	//}
	//
	//return

	http.HandleFunc("/login", loginPostHandler)
	http.HandleFunc("/logout", logoutPostHandler)
	http.HandleFunc("/register", registerPostHandler)
	http.HandleFunc("/verify_mfa", verifyMfaPostHandler)

	http.HandleFunc("/user", userGetHandler)
	http.HandleFunc("/is_logged_in", isLoggedInGetHandler)

	store = sessions.NewCookieStore([]byte("janielubiecreepery"))

	port := "5000"
	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}

func loginPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	var ld structs.LoginData
	err := json.NewDecoder(r.Body).Decode(&ld)
	if err != nil {
		log.Fatal(err)
		return
	}

	session, _ := store.Get(r, "session")

	if !db.Login(ld.Username, ld.Password) {
		response := structs.BasicResponse{Status: "error", Message: "Login or username incorrect."}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		err = json.NewEncoder(w).Encode(response)
		return
	}

	user, err := db.GetUserData(ld.Username)
	if err != nil {
		response := structs.BasicResponse{Status: "error", Message: err.Error()}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		err = json.NewEncoder(w).Encode(response)
	}

	session.Values["username"] = ld.Username
	session.Values["mfa_verified"] = true

	if user.UserD.Email2fa || user.UserD.EnableTotp {
		session.Values["mfa_verified"] = false
	}

	if user.UserD.Email2fa {
		code := funcs.GenerateCode()
		fmt.Println(code)
		// err := funcs.SendEmail(user.UserD.Email, code)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		session.Values["mfa_code"] = code
	}

	err = session.Save(r, w)
	if err != nil {
		log.Fatal(err)
	}

	response := structs.LoginResponse{
		Status:            "success",
		Message:           "MFA code sent",
		IsEmail2FAEnabled: user.UserD.Email2fa,
		IsTOTPEnabled:     user.UserD.EnableTotp}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Fatal(err)
	}
	return
}

func registerPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	var rd structs.RegisterData
	err := json.NewDecoder(r.Body).Decode(&rd)
	if err != nil {
		log.Fatal(err)
		return
	}

	otpSecret, url := funcs.GenerateSecret(rd.Username)

	var response any

	err = db.Register(rd.Username, rd.Password, rd.Email, otpSecret, rd.EnableEmail2FA, rd.EnableTOTP)
	if err == nil {
		response = structs.RegisterResponse{Status: "success", OtpSecret: otpSecret, Url: url}
	} else {
		response = structs.BasicResponse{Status: "error", Message: "User already exists."}
		w.WriteHeader(http.StatusUnauthorized)
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(response)
}

func verifyMfaPostHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	if r.Method != "POST" {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	var vd structs.VerifyData
	err := json.NewDecoder(r.Body).Decode(&vd)
	if err != nil {
		log.Fatal(err)
		return
	}

	var validateTotp bool

	username := session.Values["username"]
	user, err := db.GetUserData(fmt.Sprintf("%v", username))
	validateEmailMfa := vd.Code == session.Values["mfa_code"] || !vd.Email2FA
	if vd.EnableOTP && username != nil {
		validateTotp, _ = totp.ValidateCustom(vd.Totp, user.UserD.OtpSecret, time.Now(), totp.ValidateOpts{
			Period:    30,
			Skew:      2,
			Digits:    otp.DigitsSix,
			Algorithm: otp.AlgorithmSHA1,
		})
	} else {
		validateTotp = true
	}

	fmt.Println(validateTotp)
	var response structs.BasicResponse

	if validateTotp && validateEmailMfa {
		session.Values["mfa_verified"] = true
		session.Values["mfa_code"] = nil
		err = session.Save(r, w)
		if err != nil {
			log.Fatal(err)
		}
		response = structs.BasicResponse{Status: "success", Message: "MFA verified."}
	} else {
		response = structs.BasicResponse{Status: "error", Message: "Invalid MFA code."}
		w.WriteHeader(http.StatusUnauthorized)
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(response)
}

func logoutPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		return
	}
	session, _ := store.Get(r, "session")
	// session.Values["username"] = nil
	session.Values["mfa_verified"] = false
	err := session.Save(r, w)
	if err != nil {
		log.Fatal(err)
	}
	response := structs.BasicResponse{Status: "success", Message: "Logged out."}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Fatal(err)
	}
}

func isLoggedInGetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		return
	}
	session, _ := store.Get(r, "session")

	var response any
	if session.Values["mfa_verified"] == true {
		response = structs.UserLoggedInS{Status: "success", LoggedIn: true, User: fmt.Sprintf("%v", session.Values["username"])}
	} else {
		response = structs.UserLoggedInF{Status: "success", LoggedIn: false}
		w.WriteHeader(http.StatusUnauthorized)
	}
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Fatal(err)
	}
}

func userGetHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	session, _ := store.Get(r, "session")

	var response any
	if session.Values["mfa_verified"] == true {
		response = structs.UserResponse{Status: "success", User: fmt.Sprintf("%v", session.Values["username"])}
	} else {
		response = structs.BasicResponse{Status: "error", Message: "User not authenticated."}
		w.WriteHeader(http.StatusUnauthorized)
	}
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Fatal(err)
	}
}
