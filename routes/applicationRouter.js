const express = require('express');
const { getAllApplication, createApplication } = require('../controllers/applicationController');
const router = express.Router();


router.route("/").get(getAllApplication).post(createApplication);

module.exports = router;