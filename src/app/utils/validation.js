// ✅ Full Name
export const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  if (name.length < 3) return "Minimum 3 characters required";
  return "";
};

// ✅ Email
export const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter valid email";
  }
  return "";
};

// ✅ Mobile
export const validateMobile = (mobile) => {
  if (!mobile) return "Mobile number required";
  if (!/^[0-9]{10}$/.test(mobile)) {
    return "Enter valid 10-digit number";
  }
  return "";
};

// ✅ OTP
export const validateOtp = (otp) => {
  if (!otp) return "OTP required";
  if (!/^[0-9]{6}$/.test(otp)) {
    return "Enter valid 6-digit OTP";
  }
  return "";
};

// ✅ Password
export const validatePassword = (password) => {
  if (!password) return "Password required";
  if (password.length < 6) return "Minimum 6 characters required";
  return "";
};