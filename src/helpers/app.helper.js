
class AppHelper {
  /**
   * Lấy cấu hình theo môi trường chạy
   * @param {string} env - Môi trường (Dev, Prod...)
   * @param {object} config - Danh sách cấu hình
   */
  static getConfig(env, config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Config không hợp lệ');
    }

    return config[env] || config.Dev;
  }
}

module.exports = AppHelper;
