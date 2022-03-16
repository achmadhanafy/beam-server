const express = require('express')
const router = require('./src/routes')
const app = express()
const port = 5000
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors())

app.get('/', function(request, response) {
    response.send('Hello World!');
    });
app.use('/api/v1',router)

app.listen(process.env.PORT || port, ()=> console.log(`App listening at http://localhost:${port}`))