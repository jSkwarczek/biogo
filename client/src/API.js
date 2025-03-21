const API = {
  login: (username, password) => {
    return fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  },
  register: (
    username,
    password,
    email,
    secondEmail,
    enableEmail2FA,
    enableTOTP,
    photos
  ) => {
    return fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
        secondEmail,
        enableEmail2FA,
        enableTOTP,
        otpSecret: "",
        photos,
      }),
    }).then((res) => res.json());
  },
  verifyMFA: (code, totp, email_2fa, enable_otp, photo) => {
    return fetch("/api/verify_mfa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, totp, email_2fa, enable_otp, photo }),
    }).then((res) => res.json());
  },
  logout: () => {
    return fetch("/api/logout", {
      method: "POST",
    }).then((res) => res.json());
  },
  isLoggedIn: () => {
    return fetch("/api/is_logged_in", {
      method: "GET",
    }).then((res) => res.json());
  },
  getUser: () => {
    return fetch("/api/user", {
      method: "GET",
    }).then((res) => res.json());
  },
};

export default API;
