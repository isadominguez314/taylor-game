// const express = require('express');
// const serveIndex = require('serve-index');

// const app = express();

// app.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   next();
// });

// app.use('/request-type', (req, res, next) => {
//   console.log('Request type: ', req.method);
//   next();
// });

// app.use('/public', express.static('public'));
// app.use('/public', serveIndex('public'));

// app.get('/', (req, res) => {
//   res.send('Successful response.');
// });

// app.listen(3000, () => console.log('Example app is listening on port 3000.'));


const csv = require('csvtojson');
const Path = require('path');
const csvFilePath = Path.join(__dirname, "lyrics_cleaned.csv");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());

const chooseRandomSong = async () => {
    const songsArray = await csv().fromFile(csvFilePath);
    var randomNum = Math.floor(Math.random() * ((songsArray.length)));
    return(songsArray[randomNum]);
}

app.get('/', async (req, res) => {
    var randomSong = await chooseRandomSong();
    res.send(randomSong);
    console.log(randomSong);
})

app.listen(port, () => {
    console.log('App listening on port ' + port);
})