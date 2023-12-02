const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer();
const _routev1 = require('./api/v1/routes/_routeV1.js');

/* define port */
const _PORT = parseInt(process.env.PORT) || 8080;

/* content-type application/json */
app.use(express.json());
/* make url caseSensitive and Strict */
app.use(express.Router({
  caseSensitive: true,
  strict: true
}));
/* content-type x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));
/* content-type multipart/form-data */
app.use(upload.none());
/* disable x-powered-by Express Header */
app.set('x-powered-by', false);
/* determine IP address of the client connected */
app.set('trust proxy', true);
/* base url */
app.get('/', (req, res) => {
  console.info(new Date().toLocaleString());
  res.append('X-Powered-By', 'https://github.com/barjakoub?tab=repositories')
    .json({
      status: "OK",
      message: "Welcome to Biger!",
      team_id: "CH2-PS514"
    });
});
/* using authentication route v1 */
app.use('/api/v1', _routev1);
/* starting the server */
app.listen(_PORT, () => {
  console.info(`now server is running!`);
});
