const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationcontroller');
const validatetoken = require('../middleware/validatetoken');

router.post('/checkAvailability',validatetoken, reservationController.checkAvailaity_Controller)
router.post('/createReservation',validatetoken,reservationController.createReservation);
router.put('/updateReservation/:reservationId', validatetoken, reservationController.updateReservation)
router.delete('/deleteReservation/:reservationId', validatetoken, reservationController.deleteReservation);
module.exports = router;