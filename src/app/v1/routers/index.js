const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const healthcheck = {
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date()
  };
  res.status(200).json(healthcheck);   
});

module.exports = router;
