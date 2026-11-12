const express = require('express');
const router = express.Router();

const healthcheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is running',
    timestamp: new Date().toISOString()
  });
};

router.get('/health', healthcheck);

module.exports = router;
