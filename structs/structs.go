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

type ModelResponse struct {
	Status string `json:"status"`
}

type RegisterData struct {
	Username       string   `json:"username"`
	Password       string   `json:"password"`
	Email          string   `json:"email"`
	EnableEmail2FA bool     `json:"enableEmail2FA"`
	EnableTOTP     bool     `json:"enableTOTP"`
	Photos         []string `json:"photos"`
}

type PhotoRegisterRequest struct {
	Username string   `json:"username"`
	Photos   []string `json:"photos"`
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
	Photo     string `json:"photo"`
}

type BioCheckRequest struct {
	Username string `json:"username"`
	Photo    string `json:"photo"`
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
