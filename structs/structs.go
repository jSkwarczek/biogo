package structs

type LoginData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Status            string `json:"status"`
	Message           string `json:"message"`
	IsEmail2FAEnabled bool   `json:"isEmail2FAEnabled"`
	IsTOTPEnabled     bool   `json:"isTOTPEnabled"`
}

type BasicResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type RegisterData struct {
	Username       string `json:"username"`
	Password       string `json:"password"`
	Email          string `json:"email"`
	EnableEmail2FA bool   `json:"enableEmail2FA"`
	EnableTOTP     bool   `json:"enableTOTP"`
}

type RegisterResponse struct {
	Status    string `json:"status"`
	OtpSecret string `json:"otpSecret"`
	Url       string `json:"url"`
}

type VerifyData struct {
	Code      string `json:"code"`
	Totp      string `json:"totp"`
	Email2FA  bool   `json:"email_2fa"`
	EnableOTP bool   `json:"enable_otp"`
}

type UserLoggedInS struct {
	Status   string `json:"status"`
	LoggedIn bool   `json:"logged_in"`
	User     string `json:"user"`
}

type UserLoggedInF struct {
	Status   string `json:"status"`
	LoggedIn bool   `json:"logged_in"`
}

type UserResponse struct {
	Status string `json:"status"`
	User   string `json:"user"`
}
