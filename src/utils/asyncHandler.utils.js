const asyncHandlerUtils = (fn) => (req, res, next) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };    
};

module.exports = asyncHandlerUtils;