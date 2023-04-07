const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 4000

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 6, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
		'Ấn ít thôi, ấn nhiều lần quá =)))',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.get('/signup',limiter, (req, res) => {
  res.send("Hello")
})

app.listen(port, () => {
  console.log("Localhost dang chay cong: " + port);
})