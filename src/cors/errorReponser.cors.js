class ErrorReponser {
  constructor({ status, code, message }) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

module.exports = {
  ErrorReponser
};
