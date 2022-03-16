const express = require('express')
const router = express.Router()

//Controller
const { register } = require('../controller/register')
const { login, logout } = require('../controller/login')
const { getUser } = require('../controller/user')

//Middlewares
const { auth } = require('../middleware/auth')


//Routes
router.post('/register',register)
router.post('/login',login)
router.delete('/logout',auth,logout)
router.get('/user',auth,getUser)

module.exports = router