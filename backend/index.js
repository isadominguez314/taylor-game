const csv = require('csvtojson');
const Path = require('path');
const csvFilePath = Path.join(__dirname, "lyrics_cleaned.csv");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
  })
  
  app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
  })
  
  app.get('/about', (req, res) => {
    res.send('This is my about route..... ')
  })

// const chooseRandomSong = async () => {
//     const songsArray = await csv().fromFile(csvFilePath);
//     var randomNum = Math.floor(Math.random() * ((songsArray.length)));
//     return(songsArray[randomNum]);
// }

// app.get('/', async (req, res) => {
//     var randomSong = await chooseRandomSong();
//     res.send(randomSong);
//     console.log(randomSong);
// })

// app.listen(port, () => {
//     console.log('App listening on port ' + port);
// })

module.exports = app; // Export the Express app