import Api from "../api";

export const login = async (email, password) => {
  try {
    const res = await Api.post(`/user/login`, {
      email,
      password,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const register = async (email, password) => {
  try {
    const res = await Api.post(`/user/register`, {
      email,
      password,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (email, otpCode) => {
  try {
    const res = await Api.post(`/user/verify-email`, {
      email,
      otpCode,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const resendVerifyEmail = async (email) => {
  try {
    const res = await Api.post(`/user/resend-verify-email`, {
      email,
    });
    if (res) {
      return res;
    }
  } catch (err) {
    throw err;
  }
};

export const verifyKyc = async () => {
  try {
    const res = await Api.post(`/user/verify-kyc`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const res = await Api.get(`/user/profile`);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await Api.post(`/user/change-password`, {
      oldPassword,
      newPassword,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await Api.post(`/user/forgot-password`, {
      email,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const resetPasswordOTP = async (email, otpCode) => {
  try {
    const res = await Api.post(`/user/verify-reset-otp`, {
      email,
      otpCode,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const res = await Api.post(`/user/reset-password`, {
      email,
      newPassword,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};

export const changeEmail = async (email) => {
  try {
    const res = await Api.post(`/user/change-email`, {
      email,
    });
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
};
