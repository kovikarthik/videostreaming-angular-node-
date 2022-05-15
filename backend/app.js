const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(cors())
// app.get('/video', (req, res) => {
//     res.sendFile('assets/video1.mp4', { root: __dirname });
// });

//videos route
const Videos = require('./routes/Videos.js')
app.use('/videos', Videos)

app.listen(8080, () => {
    console.log('Listening on port 8080!')
}); 

