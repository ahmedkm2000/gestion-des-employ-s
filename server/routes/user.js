const express = require('express');
const router = express.Router();
const { view, find, adduser, insertuser, edituser, updateuser, deleteuser, viewuser } = require('../controllers/userController.js');

router.get('/', view)
router.post('/', find)
router.get('/adduser', adduser)
router.post('/adduser', insertuser)
router.get('/edituser/:id', edituser)
router.post('/edituser/:id', updateuser)
router.get('/deleteuser/:id', deleteuser)
router.get('/viewuser/:id', viewuser)



module.exports = router