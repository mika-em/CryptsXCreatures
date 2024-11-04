class Utils {
  static apiPath = 'cxc/api';

  static setCookie(res, name, value, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'Lax'
    };
    const cookieOptions = { ...defaultOptions, ...options };
    res.cookie(name, value, cookieOptions);
  }

  static invalidateCookie(res, name) {
    res.clearCookie(name);
  }
}

module.exports = Utils;