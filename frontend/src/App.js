import './App.css';
import React, {useState, useEffect} from "react";
import CircleIcon from ".//icons/circle-icon.png";
import clickedQuestion from ".//icons/clicked-question.png"
import unclickedQuestion from ".//icons/unclicked-question.png"

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
  const [pageNumber, setPageNumber] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [showInstruct, setShowInstruct] = useState(false);

  async function pullFromBackend(){
    fetch("http://localhost:8080/?").then((result) => 
    result = result.json()).then((data) => {setSong(data)})
    console.log('song', song);
  }

  function startGame() {
    setPageNumber(1);
    pullFromBackend();
    // if (!inProgress) {
    //   pullFromBackend();
    // }
    // setInProgress(true);
    // setCurRound(1);
    // setScore(0);
    // resetVals();
    // pullFromBackend();
  }

  function resetVals() {
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
  }

  function nextSong() {
    // setAlbumHint(false);
    // setLyricHint(false);
    // setCorrect('');
    // setSongCorrect(false);
    // setLyricCorrect(false);
    // setLyricReveal(false);
    // setSongReveal(false);
    // setSongGuesses(3);
    // setLyricGuesses(3);
    // setSongPoints(10);
    // setLyricPoints(10);
    resetVals();
    if (curRound === numRounds) {
      endGame();
    } else {
      setCurRound(curRound + 1);
      pullFromBackend();
    }
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

  function backToStart(){
    setPageNumber(0);
    setNumRounds(0);
    setCurRound(1);
    setScore(0);
    resetVals();
  }

  function endGame() {
    setPageNumber(2);
    setInProgress(false);
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

  async function checkSongInput () {
    // lower case
    let tmp = songInput.toLowerCase();
    // split by parentheses
    tmp = tmp.split('(')[0];
    // remove whitespace
    tmp = tmp.replaceAll(' ', '');
    // only alphanumeric
    tmp = tmp.replace(/[^a-zA-Z0-9]/g, '');
    if (tmp === song["Song Entry"]) {
      setCorrect("CORRECT SONG");
      setSongCorrect(true);
      setScore(score + songPoints);
    } else {
      setCorrect("INCORRECT SONG");
      if (songGuesses === 1) {
        revealSong();
      }
      setSongGuesses(songGuesses - 1);
      setSongPoints(songPoints - 2);
    }
    return;
  }

  async function checkLyricInput() {
    // lower case
    let tmp = lyricInput.toLowerCase();
    // remove whitespace
    tmp = tmp.replaceAll(' ', '');
    // only alphanumeric
    tmp = tmp.replace(/[^a-zA-Z0-9]/g, '');
    if (tmp === song["Lyric Entry"]) {
      setCorrect("CORRECT LYRIC");
      setLyricCorrect(true);
      setScore(score + lyricPoints);
    } else {
      setCorrect("INCORRECT LYRIC");
      if (lyricGuesses === 1) {
        revealLyric();
      }
      setLyricGuesses(lyricGuesses - 1);
      setLyricPoints(lyricPoints - 2);
    }
  }

  async function checkAll() {
    await checkSongInput();
    await checkLyricInput();
  }

  // const checkAll = async () => {
  //   const result = await checkSongInput();
  //   checkLyricInput();
  //   // do something else here after firstFunction completes
  // }

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
      setTimeout(nextSong, 2500);
    }
  }, [lyricCorrect, songCorrect, songReveal, lyricReveal, nextSong]);

  // const StartPage = () => {
  //   return (
  //     <div className = "start-screen">
  //         <h1> TAYLOR SWIFT LYRIC GAME </h1>
  //         <h4> INSTRUCTIONS: You will be presented with a random lyric from a Taylor Swift song. Your goal is to guess the name of the song and the following lyric. You have 3 guesses for each input and you can request album and previous lyric hints. The album hint will change the background of the game to the color matching the target lyric's album. The previous lyric hint will provide you with the lyric that preceded the target lyric. If you are stumped, you can reveal the song title, the next lyric, or you can skip the question. You can choose to play 5 rounds or you can choose free play and end the game when you are ready.</h4>
  //         <h4> SCORING: Every question has 20 available points. 10 points is available for the correct song and 10 points is available for the next lyric. Each incorrect guess and hint used decreases the available points by 2. If you skip the question or reveal an answer, no points are earned.</h4>
  //         {numRounds === 0 ? <div> <h4> How Many Rounds Would You Like To Play? </h4> <button class="unclicked-button" onClick={() => setNumRounds(5)} > 5 Rounds </button> <button class="unclicked-button" onClick={() => setNumRounds(-1)}> Free Play </button> </div>: <button class="unclicked-button" onClick={startGame}> Click Here To Play </button>}
  //     </div>
  //   );
  // };

  return (
    <div id = "entire-game">
    {pageNumber === 0 ? 
      <div className = "start-screen">
        <h1 className = "game-header"> TAYLOR SWIFT LYRIC GAME </h1>
        <div className = "instructions">
           <h4> INSTRUCTIONS: You will be presented with a random lyric from a Taylor Swift song. Your goal is to guess the name of the song and the following lyric. You have 3 guesses for each input and your guesses are case and punctuation insensitive, which means you do not need to worry about capitalization, punctuation, or correct spacing in your guesses. You can also request album and previous lyric hints. The album hint will change the background of the game to the color matching the target lyric's album. The previous lyric hint will provide you with the lyric that precedes the target lyric. If you are stumped, you can reveal the song title, the next lyric, or you can skip the question. Finally, you can choose to play 5 rounds or you can opt into free play and end the game when you are ready.</h4>
           <h4> SCORING: Each question has 20 available points. 10 points are available for the correct song and 10 points are available for the correct next lyric. Of the 10 points available for each input, each incorrect guess or hint used decreases the available points by 2. Note that you cannot lose points from your score, meaning it is always advantageous to continue guessing. If you skip the question or reveal an answer, no points are earned for that input. </h4>
        </div>
           {numRounds === 0 ? <div> <h4> How Many Rounds Would You Like To Play? </h4> <button id = "b1" class="unclicked-button" onClick={() => setNumRounds(5)} > 5 Rounds </button> <button id = "b2" class="unclicked-button" onClick={() => setNumRounds(-1)}> Free Play </button> </div>: <button id="b3" class="unclicked-button" onClick={startGame}> Click Here To Play </button>}
      </div> : pageNumber === 1 ?
      <div className = "App">
        {/* {showInstruct ? <button id = "hide-instructions" onClick={() => setShowInstruct(false)}> Hide </button> : <button id = "show-instructions" onClick={() => setShowInstruct(true)}> Show </button>} */}
            
        <div className="App" id = "my-game" >
            
            {showInstruct ? <button className = "hide-instructions" id = "hide-instructions" onClick={() => setShowInstruct(false)}> <img src={clickedQuestion} className = "question-mark" alt=''/> </button> : <button id = "show-instructions" onClick={() => setShowInstruct(true)}> <img className = "question-mark" src={unclickedQuestion} alt=''/> </button>}
            <h1 className = "game-header" > TAYLOR SWIFT LYRIC GAME </h1>
             {showInstruct ? <div className = "instructions">
              <h5> INSTRUCTIONS: You will be presented with a random lyric from a Taylor Swift song. Your goal is to guess the name of the song and the following lyric. You have 3 guesses for each input and your guesses are case and punctuation insensitive, which means you do not need to worry about capitalization, punctuation, or correct spacing in your guesses. You can also request album and previous lyric hints. The album hint will change the background of the game to the color matching the target lyric's album. The previous lyric hint will provide you with the lyric that precedes the target lyric. If you are stumped, you can reveal the song title, the next lyric, or you can skip the question. Finally, you can choose to play 5 rounds or you can opt into free play and end the game when you are ready.</h5>
              <h5> SCORING: Each question has 20 available points. 10 points are available for the correct song and 10 points are available for the correct next lyric. Of the 10 points available for each input, each incorrect guess or hint used decreases the available points by 2. Note that you cannot lose points from your score, meaning it is always advantageous to continue guessing. If you skip the question or reveal an answer, no points are earned for that input. </h5>
             </div> : <></>}
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
                {/* <button onClick = {checkAll}> Check All </button> */}
                <button onClick = {clickNext}> Skip Question </button>
                <button onClick = {() => setPageNumber(2)}> End Game </button>
              </div>
            </div>
          <h2 id="correct-label"> {correct} </h2>
          <div id = "b4" className = "stats">
            {numRounds === -1 ? <h3>Round: {curRound} </h3>: <h3>Round: {curRound}/{numRounds} </h3>} 
            <h3> Score: {score} </h3> 
            <h3> Points Available This Round: {lyricPoints + songPoints} </h3>
          </div> 
        </div> 
      </div>
      : 
      <div className = "end-screen">
        <h1 className = "game-header"> TAYLOR SWIFT LYRIC GAME </h1>
          <div className = "stats">
            <h2> Rounds Played: {curRound} </h2> 
            <h2>Points Earned: {score} </h2> 
            <h2> Accuracy: {parseFloat(score/(curRound * 20) * 100).toFixed(2)}% </h2>
          </div>
         <h4> Above are your stats from the game you just played. Thank you for playing and click below if you'd like to play again! </h4>
        <button id = "b5" class="unclicked-button" onClick={backToStart}> Play Again </button>
      </div>
      }
    </div>
  );

  // return (
  //   <div>
  //     {startScreen ?
  //       <div className = "start-screen">
  //         <h1> TAYLOR SWIFT LYRIC GAME </h1>
  //         <h4> INSTRUCTIONS: You will be presented with a random lyric from a Taylor Swift song. Your goal is to guess the name of the song and the following lyric. You have 3 guesses for each input and you can request album and previous lyric hints. The album hint will change the background of the game to the color matching the target lyric's album. The previous lyric hint will provide you with the lyric that preceded the target lyric. If you are stumped, you can reveal the song title, the next lyric, or you can skip the question. You can choose to play 5 rounds or you can choose free play and end the game when you are ready.</h4>
  //         <h4> SCORING: Every question has 20 available points. 10 points is available for the correct song and 10 points is available for the next lyric. Each incorrect guess and hint used decreases the available points by 2. If you skip the question or reveal an answer, no points are earned.</h4>
  //         {numRounds === 0 ? <div> <h4> How Many Rounds Would You Like To Play? </h4> <button class="unclicked-button" onClick={() => setNumRounds(5)} > 5 Rounds </button> <button class="unclicked-button" onClick={() => setNumRounds(-1)}> Free Play </button> </div>: <button class="unclicked-button" onClick={startGame}> Click Here To Play </button>}
  //       </div> : 
  //       <div> 
  //         <div className="App" id = "my-game">
  //           <h1 className = "words"> TAYLOR SWIFT LYRIC GAME </h1>
  //           <div className = "hints-buttons">
  //             {albumHint ? <button className = "clicked-button"> Show Album </button> : <button className = "unclicked-button" onClick={setAlbum}> Show Album</button>}
  //             {lyricHint ? <button className = "clicked-button"> Show Previous Lyric </button> : <button className = "unclicked-button" onClick={setPrevLyric}> Show Previous Lyric </button>}          
  //           </div>
  //           <h2 id = "prev-lyric" className = "words"> {lyricHint? '"' + song['Previous Lyric'] + '"...' : <p></p>}</h2>
  //           <h1 id = "target-lyric" className = "words"> "{song.Lyric}" </h1>
  //           <div className = "input-section">
  //             <div className = "indiv-inputs">
  //             <h3> Song Title: </h3>
  //             {songCorrect | songReveal ? <h3> "{song['Song']}" </h3> : <div className = "one-line"> <input type="text" onChange={getSongInput}></input> <button onClick = {checkSongInput}> Check </button> <button onClick = {revealSong}> Reveal </button> 
  //             <div> {songGuesses === 3 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
  //             : songGuesses ===2 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
  //             : <img alt=''src={CircleIcon} className = 'circle-icon'/>}</div></div>}
  //           </div>
  //           <div className = "indiv-inputs">
  //             <h3> Next {song['Next Lyric']?.split(' ').length} Words: </h3>
  //             {lyricCorrect | lyricReveal ? <h3> "{song['Next Lyric']}" </h3> : <div className = "one-line"> <input type="text" onChange={getLyricInput}></input> <button onClick = {checkLyricInput}> Check </button> <button onClick = {revealLyric}> Reveal </button> 
  //             <div> {lyricGuesses === 3 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
  //               : lyricGuesses ===2 ? <div> <img alt=''src={CircleIcon} className = 'circle-icon'/> <img alt=''src={CircleIcon} className = 'circle-icon'/> </div> 
  //               : <img alt=''src={CircleIcon} className = 'circle-icon'/>}</div></div>}
  //             </div>
  //             <div className = "check-buttons">
  //               <button onClick = {checkAll}> Check All </button>
  //               <button onClick = {clickNext}> Skip Question </button>
  //             </div>
  //           </div>
  //         <h2 id="correct-label"> {correct} </h2>
  //         <div className = "stats">
            
  //           {numRounds === -1 ? <h3>Round: {curRound} </h3>: <h3>Round: {curRound}/{numRounds} </h3>} 
  //           <h3> Score: {score} </h3> 
  //           <h3> Points Available This Round: {lyricPoints + songPoints} </h3>
            
  //         </div> 
  //       </div> 
  //     </div>}
  //     <div> 
  //       <h1> TAYLOR SWIFT LYRIC GAME </h1>
  //       <h2> Insert Stats Here </h2>
  //       <h4> Thank you for playing the game and click if you'd like to play again. </h4>
  //     </div>
  //   </div>
    
    
  // );
}

export default App;