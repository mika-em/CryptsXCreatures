class Utils {
  static apiPath = "cxc/api";

  static setCookie(res, name, value, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };
    const cookieOptions = { ...defaultOptions, ...options };
    res.cookie(name, value, cookieOptions);
  }

  static invalidateCookie(res, name, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 0
    };
    const cookieOptions = { ...defaultOptions, ...options };
    res.clearCookie(name, cookieOptions);
  }

  static hashString(string) {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(string, salt);
  }
}

module.exports = Utils;
