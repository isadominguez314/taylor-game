import './App.css';
import React, {useState, useEffect} from "react";
import CircleIcon from ".//icons/circle-icon.png";

function App() {

  let game = document.getElementById('my-game');
  let words = document.getElementsByClassName('words');
  let prevLyric = document.getElementById('prev-lyric');

  const [song, setSong] = useState("");
  const [correct, setCorrect] = useState("");
  const [albumHint, setAlbumHint] = useState(false);
  const [lyricHint, setLyricHint] = useState(false);
  const [songInput, setSongInput] = useState("");
  const [lyricInput, setLyricInput] = useState("");
  const [songCorrect, setSongCorrect] = useState(false);
  const [lyricCorrect, setLyricCorrect] = useState(false);
  const [songReveal, setSongReveal] = useState(false);
  const [lyricReveal, setLyricReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [songGuesses, setSongGuesses] = useState(3);
  const [lyricGuesses, setLyricGuesses] = useState(3);
  const [songPoints, setSongPoints] = useState(10);
  const [lyricPoints, setLyricPoints] = useState(10);
  const [startScreen, setStartScreen] = useState(true);
  const [numRounds, setNumRounds] = useState(0);
  const [curRound, setCurRound] = useState(1);

  async function pullFromBackend(){
    fetch("http://localhost:8080/?").then((result) => 
    result = result.json()).then((data) => {setSong(data)})
    console.log('song', song);
  }

  function startGame() {
    setStartScreen(false);
    pullFromBackend();
  }

  function nextSong() {
    setAlbumHint(false);
    setLyricHint(false);
    setCorrect('');
    setSongCorrect(false);
    setLyricCorrect(false);
    setLyricReveal(false);
    setSongReveal(false);
    setSongGuesses(3);
    setLyricGuesses(3);
    setSongPoints(10);
    setLyricPoints(10);
    console.log('curRound', curRound);
    console.log('numRound', numRounds);
    if (curRound === numRounds) {
      endGame();
    }
    setCurRound(curRound + 1);
    pullFromBackend();
    game.style.backgroundColor = '#e6dcd4';
    for (var i = 0; i<words.length; ++i) {
      words[i].style.color = '#796b60';
    }
  }

  function clickNext() {
    revealLyric();
    revealSong();
  }

  function getSongInput(val) {
    setSongInput(val.target.value);
  }

  function getLyricInput(val) {
    setLyricInput(val.target.value);
  }

  function endGame() {
    console.log('GAME HAS ENDED');
  }

  function setAlbum(){
    setAlbumHint(true);
    game.style.backgroundColor = song['Color'];
    for (var i = 0; i<words.length; ++i) {
      words[i].style.color = song['Lyric Color'];
    } 
    if (songPoints >= 2) {
      setSongPoints(songPoints - 2);
    } 
    if (lyricPoints >= 2) {
      setLyricPoints(lyricPoints - 2);
    }
  }

  function setPrevLyric() {
    setLyricHint(true);
    if (albumHint && prevLyric) {
      prevLyric.style.color = song['Lyric Color'];
    }
    if (songPoints >= 2) {
      setSongPoints(songPoints - 2);
    } 
    if (lyricPoints >= 2) {
      setLyricPoints(lyricPoints - 2);
    }
  }

  function checkSongInput () {
    // lower case
    let tmp = songInput.toLowerCase();
    // split by parentheses
    tmp = tmp.split('(')[0];
    // remove whitespace
    tmp = tmp.replaceAll(' ', '');
    // only alphanumeric
    tmp = tmp.replace(/[^a-zA-Z0-9]/g, '');
    console.log('tmp input: ' + tmp);
    if (tmp === song["Song Entry"]) {
      setCorrect("CORRECT");
      setSongCorrect(true);
      setScore(score + songPoints);
    } else {
      setCorrect("INCORRECT");
      if (songGuesses === 1) {
        revealSong();
      }
      setSongGuesses(songGuesses - 1);
      setSongPoints(songPoints - 2);
    }
  }

  function checkLyricInput() {
    // lower case
    let tmp = lyricInput.toLowerCase();
    // remove whitespace
    tmp = tmp.replaceAll(' ', '');
    // only alphanumeric
    tmp = tmp.replace(/[^a-zA-Z0-9]/g, '');
    console.log('tmp input: ' + tmp);
    if (tmp === song["Lyric Entry"]) {
      setCorrect("CORRECT");
      setLyricCorrect(true);
      setScore(score + lyricPoints);
    } else {
      setCorrect("INCORRECT");
      if (lyricGuesses === 1) {
        revealLyric();
      }
      setLyricGuesses(lyricGuesses - 1);
      setLyricPoints(lyricPoints - 2);
    }
  }

  function checkAll() {
    checkSongInput();
    checkLyricInput();
  }

  function revealLyric() {
    setLyricReveal(true);
    setLyricPoints(0);
    setCorrect('');
  }

  function revealSong() {
    setSongReveal(true);
    setSongPoints(0);
    setCorrect('');
  }

  useEffect(() => {
    if ((lyricCorrect | lyricReveal) && (songCorrect | songReveal)) {
      setResetTimer(true);
      setTimeout(nextSong, 2000);
    }
  }, [lyricCorrect, songCorrect, songReveal, lyricReveal, nextSong]);

  return (
    <div>
      {startScreen ?
        <div className = "start-screen">
          <h1> TAYLOR SWIFT LYRIC GAME </h1>
          <h4> INSTRUCTIONS: You will be presented with a random lyric from a Taylor Swift song. Your goal is to guess the name of the song and the following lyric. You have 3 guesses for each input and you can request album and previous lyric hints. The album hint will change the background of the game to the color matching the target lyric's album. The previous lyric hint will provide you with the lyric that preceded the target lyric. If you are stumped, you can reveal the song title, the next lyric, or you can skip the question. You can choose to play 5 rounds or you can choose free play and end the game when you are ready.</h4>
          <h4> SCORING: Every question has 20 available points. 10 points is available for the correct song and 10 points is available for the next lyric. Each incorrect guess and hint used decreases the available points by 2. If you skip the question or reveal an answer, no points are earned.</h4>
          {numRounds === 0 ? <div> <h4> How Many Rounds Would You Like To Play? </h4> <button class="unclicked-button" onClick={() => setNumRounds(5)} > 5 Rounds </button> <button class="unclicked-button" onClick={() => setNumRounds(-1)}> Free Play </button> </div>: <button class="unclicked-button" onClick={startGame}> Click Here To Play </button>}
        </div> : 
        <div> 
          <div className="App" id = "my-game">
            <h1 className = "words"> TAYLOR SWIFT LYRIC GAME </h1>
            <div className = "hints-buttons">
              {albumHint ? <button className = "clicked-button"> Show Album </button> : <button className = "unclicked-button" onClick={setAlbum}> Show Album</button>}
              {lyricHint ? <button className = "clicked-button"> Show Previous Lyric </button> : <button className = "unclicked-button" onClick={setPrevLyric}> Show Previous Lyric </button>}          
            </div>
            <h2 id = "prev-lyric" className = "words"> {lyricHint? '"' + song['Previous Lyric'] + '"...' : <p></p>}</h2>
            <h1 id = "target-lyric" className = "words"> "{song.Lyric}" </h1>
            <div className = "input-section">
              <div className = "indiv-inputs">
              <h3> Song Title: </h3>
              {songCorrect | songReveal ? <h3> "{song['Song']}" </h3> : <div className = "one-line"> <input type="text" onChange={getSongInput}></input> <button onClick = {checkSongInput}> Check </button> <button onClick = {revealSong}> Reveal </button> 
              <div> {songGuesses === 3 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
              : songGuesses ===2 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
              : <img alt=''src={CircleIcon} className = 'circle-icon'/>}</div></div>}
            </div>
            <div className = "indiv-inputs">
              <h3> Next {song['Next Lyric']?.split(' ').length} Words: </h3>
              {lyricCorrect | lyricReveal ? <h3> "{song['Next Lyric']}" </h3> : <div className = "one-line"> <input type="text" onChange={getLyricInput}></input> <button onClick = {checkLyricInput}> Check </button> <button onClick = {revealLyric}> Reveal </button> 
              <div> {lyricGuesses === 3 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
                : lyricGuesses ===2 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
                : <img alt=''src={CircleIcon} className = 'circle-icon'/>}</div></div>}
              </div>
              <div className = "check-buttons">
                <button onClick = {checkAll}> Check All </button>
                <button onClick = {clickNext}> Skip Question </button>
              </div>
            </div>
          <h2 id="correct-label"> {correct} </h2>
          <div className = "stats">
            
            {numRounds === -1 ? <h3>Round: {curRound} </h3>: <h3>Round: {curRound}/{numRounds} </h3>} 
            <h3> Score: {score} </h3> 
            <h3> Points Available This Round: {lyricPoints + songPoints} </h3>
            
          </div> 
        </div> 
      </div>}
      <div> 
        <h1> TAYLOR SWIFT LYRIC GAME </h1>
        <h2> Insert Stats Here </h2>
        <h4> Thank you for playing the game and click if you'd like to play again. </h4>
      </div>
    </div>
    
    
  );
}

export default App;
