class Utils {
  static apiPath = "cxc/api";

  static setCookie(res, name, value, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
    };
    const cookieOptions = { ...defaultOptions, ...options };
    res.cookie(name, value, cookieOptions);
  }

  static invalidateCookie(res, name, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 0,
      path: '/',
    };
    const cookieOptions = { ...defaultOptions, ...options };
    res.clearCookie(name, cookieOptions);
  }

  static hashString(string) {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(string, salt);
  }

  static hexEncodeText(text) {
    const buffer = Buffer.from(text, 'utf-8');
    return buffer.toString('hex');
  }

  static hexDecodeText(hex) {
    const buffer = Buffer.from(hex, 'hex');
    return buffer.toString('utf-8');
  }
}

module.exports = Utils;
